{
  description = "A network packet tracing and analysis tool";

  inputs = {
    nixpkgs.url = "github:NixOs/nixpkgs/nixos-unstable";
    rust-overlay = {
      url = "github:oxalica/rust-overlay";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    crane.url = "github:ipetkov/crane";
    devshell.url = "github:numtide/devshell";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = {
    self,
    nixpkgs,
    rust-overlay,
    crane,
    devshell,
    flake-utils,
  }:
    flake-utils.lib.eachDefaultSystem (system: let
      overlays = [(import rust-overlay) devshell.overlays.default];
      pkgs = import nixpkgs {inherit system overlays;};
    in {
      packages = let
        src = ./.;
        rustToolchainFor = p: p.rust-bin.stable.latest.default;
        craneLib = (crane.mkLib pkgs).overrideToolchain rustToolchainFor;
        commonArgs = {
          inherit src;
          strictDeps = true;
          nativeBuildInputs = [pkgs.pkg-config];
          buildInputs = [pkgs.openssl];
        };
      in rec {
        cargoArtifacts = craneLib.buildDepsOnly commonArgs;
        backend = craneLib.buildPackage (commonArgs
          // {
            inherit cargoArtifacts;
          });

        npm = pkgs.buildNpmPackage {
          name = "packet_tracer-npm";
          src = ./.;
          packageJson = "package.json";
          npmDepsHash = pkgs.lib.fakeHash;
          dontNpmBuild = true;
        };

        frontend = pkgs.stdenv.mkDerivation {
          name = "packet_tracer-frontend";
          src = "${npm}/lib/node_modules/packet_tracer";
          nativeBuildInputs = with pkgs; [
            nodejs
            tailwindcss_4
          ];
          buildPhase = ''
            mkdir -p public
            npx rolldown -c rolldown.config.ts -w
            tailwindcss -i ./src/frontend/theme.css -o ./public/css/index.css --minify
          '';
          installPhase = ''
            mkdir -p $out/public $out/node_modules
            cp -rf public/* $out/public
            cp -rf node_modules/* $out/node_modules
          '';
        };

        packet_tracer = pkgs.stdenv.mkDerivation {
          name = "packet_tracer";
          src = ./.;
          buildInputs = [backend frontend];
          installPhase = ''
            mkdir -p $out/bin
            cp ${backend}/bin/packet_tracer $out/bin/
            cp -rf ${frontend}/* $out
          '';
        };

        image = pkgs.dockerTools.buildImage {
          name = "packet_tracer";
          tag = "0.1.0";
          copyToRoot = pkgs.buildEnv {
            name = "image-root";
            paths = [packet_tracer];
          };
          config = {
            Cmd = ["${packet_tracer}/bin/packet_tracer"];
          };
        };
      };

      devShells.default = pkgs.devshell.mkShell ({config, ...}: {
        motd = "";
        packages = with pkgs; [
          pkg-config
          openssl
          rust-bin.stable.latest.default
          nodejs
          tailwindcss_4
          postgresql_18
          gcc
        ];
        env = [
          {
            name = "PKG_CONFIG_PATH";
            value = "${pkgs.openssl.dev}/lib/pkgconfig:${pkgs.postgresql_18}/lib/pkgconfig";
          }
        ];
        commands = [
          {
            name = "hotrun";
            command = ''
              trap 'kill 0' SIGINT

              npx rolldown -c rolldown.config.ts -w &

              cargo run &

              tailwindcss -i src/frontend/theme.css -o public/css/index.css --watch=always &

              wait
            '';
          }
          {
            name = "db";
            command = ''
              usage() {
                echo "Usage: $0 [-l] [-c]"
                echo "  -l    Launch Docker DB"
                echo "  -c    Connect via psql"
                exit 1
              }

              if [ $# -eq 0 ]; then
                usage
              fi

              while getopts "lc" opt; do
                case $opt in
                  l)
                    echo "Starting database..."
                    (
                      cd util/debug_db || exit
                      docker compose run --rm --service-ports db
                    )
                    ;;
                  c)
                    echo "Connecting to database..."
                    psql -h localhost -p 5432 -U postgres
                    ;;
                  \?)
                    usage
                    ;;
                esac
              done
            '';
          }
        ];
      });
    });
}
