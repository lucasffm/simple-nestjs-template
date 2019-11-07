import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { CodeGen } from 'swagger-js-codegen';

const filePath = resolve(__dirname, '..', '..', '..', 'client');
const swagger = JSON.parse(
  readFileSync(filePath + '/swagger-spec.json', 'UTF-8'),
);

const reactjsSourceCode = CodeGen.getReactCode({
  className: 'Test',
  swagger: swagger,
});
const fileName = filePath + '/client-react.js';
writeFileSync(fileName, reactjsSourceCode);
