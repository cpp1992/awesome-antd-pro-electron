// 获取模型
import {
  tail, first, last, nth, camelCase,
} from 'lodash';
import { pathExistsSync, mkdirpSync, writeFileSync } from 'fs-extra';
import { resolve } from 'path';

const ERPModels = (require as any).context('./json', true, /\.json$/)

function mapFieldKeys(fieldConfig: any): any[] {
  const field: any[] = fieldConfig.fields;
  return field.reduce((result, config) => {
    let newConfig = {};
    let options = [];
    const key = camelCase(config.label);
    const label = camelCase(config.label);
    const placerholder = `Input ${camelCase(config.label)}`;
    let type = 'input';
    if (config.options) {
      options = tail(config.options.split('\n').concat());
      type = 'select';
    }
    switch (config.fieldType) {
      case 'Data':
        type = 'input';
        break;
      case 'Int':
        type = 'input';
        break;
      case 'Date':
        type = 'date';
        break;
      case 'Select':
        type = 'select';
        break;
      default:
        break;
    }
    newConfig = {
      key,
      label,
      type,
      placerholder,
      options,
    };
    result.push(newConfig);
    return result;
  }, []);
}

/**
 * 将ERPModels的fields内容重新组合，只取必要字段
 */
export function genModelConfigJson() {
  const rootDir = resolve(__dirname, 'src/models');
  if (!pathExistsSync(rootDir)) mkdirpSync(rootDir);
  console.log('Root Dir is: ', rootDir);

  ERPModels.keys().forEach((fileName: string) => {
    const fileNameMeta = tail(fileName.split('/'));
    const sectionMeta = {
      section: first(fileNameMeta),
      modelName: nth(fileNameMeta, -2),
      fileName: last(fileNameMeta),
      fullPath: fileName,
    };
    // const newFieldConfig = pickFields(ERPModels(fileName)['fields'])
    const newFieldConfig = mapFieldKeys(ERPModels(fileName).fields);

    const newFolderName = resolve(
      rootDir,
      sectionMeta.section,
      sectionMeta.modelName,
    );
    const newFileName = resolve(newFolderName, sectionMeta.fileName);

    if (!pathExistsSync(newFolderName)) mkdirpSync(newFolderName);

    writeFileSync(
      newFileName,
      JSON.stringify({ fields: newFieldConfig }, null, 2),
    );
    console.log(`${fileName} created`);
  });
}
