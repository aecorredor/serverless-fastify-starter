import * as pulumi from '@pulumi/pulumi';

export const createHandlerAssetArchive = (
  handlerPath: string
): pulumi.asset.AssetArchive => {
  return new pulumi.asset.AssetArchive({
    'index.js': new pulumi.asset.FileAsset(handlerPath),
  });
};
