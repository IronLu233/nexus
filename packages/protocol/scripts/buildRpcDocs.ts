import { concatMdSync } from 'concat-md';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

// entryPoints for typedoc
const RPC_DECL_ENTRYPOINT = path.join(__dirname, './rpc.ts');
// output dir for typedoc
const TMP_OUTPUT_DIR = path.join(__dirname, '.tmpdoc');
// output dir for typedoc interfaces
const TMP_OUTPUT_INTERFACE_DIR = path.join(TMP_OUTPUT_DIR);
// output path for rpc.md
const OUTPUT_MD_PATH = path.join(__dirname, '../../../docs/rpc.md');

async function main() {
  execSync(
    `npx typedoc \
    --entryPoints "${RPC_DECL_ENTRYPOINT}" \
    --out "${TMP_OUTPUT_DIR}" \
    --hideMembersSymbol \
    --disableSources \
    --plugin typedoc-plugin-markdown \
    --hideBreadcrumbs \
    --tsconfig tsconfig.typedoc.json \
    --readme none`,
  );

  const rpcMd = concatMdSync(TMP_OUTPUT_INTERFACE_DIR, {
    toc: false,
    sorter: (a, b) => {
      if (a.includes('RpcMethods')) return -1;
      if (b.includes('RpcMethods')) return 1;
      return a.localeCompare(b);
    },
  });

  fs.writeFileSync(OUTPUT_MD_PATH, Buffer.from(rpcMd));
  fs.rmSync(TMP_OUTPUT_DIR, { recursive: true });
}

void main();
