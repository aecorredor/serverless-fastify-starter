import * as esbuild from 'esbuild';

const build = async () => {
  await esbuild.build({
    entryPoints: ['dist-post-ts/handlers/api.js'],
    bundle: true,
    platform: 'node',
    minifyWhitespace: true,
    target: ['es2020', 'node18'],
    outdir: 'dist',
  });
};

void build();
