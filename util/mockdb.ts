import { PostgresMock } from "pgmock";

const mock = await PostgresMock.create();

const connectionString = await mock.listen(6767);