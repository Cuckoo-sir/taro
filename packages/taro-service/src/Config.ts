import * as path from 'path'
import * as fs from 'fs-extra'

import { merge } from 'lodash'
import { IProjectConfig } from '@tarojs/taro/types/compile'
import {
  SOURCE_DIR,
  OUTPUT_DIR,
  ENTRY,
  resolveScriptPath,
  getBabelConfig
} from '@tarojs/helper'

import {
  CONFIG_DIR_NAME,
  DEFAULT_CONFIG_FILE
} from './utils/constants'

export default class Config {
  appPath: string
  configPath: string
  initialConfig: IProjectConfig
  isWatch: boolean
  constructor (opts) {
    this.appPath = opts.appPath
    this.isWatch = opts.isWatch
  }

  init () {
    this.configPath = path.join(this.appPath, CONFIG_DIR_NAME, DEFAULT_CONFIG_FILE)
    if (!fs.existsSync(this.configPath)) {
      // TD log
      process.exit(0)
    }
    this.initialConfig = require(this.configPath)(merge)
  }

  getConfigWithNamed (platform, useConfigName) {
    const initialConfig = this.initialConfig
    const sourceDirName = initialConfig.sourceRoot || SOURCE_DIR
    const outputDirName = initialConfig.outputRoot || OUTPUT_DIR
    const sourceDir = path.join(this.appPath, sourceDirName)
    const outputDir = path.join(this.appPath, outputDirName)
    const entryName = ENTRY
    const entryFilePath = resolveScriptPath(path.join(sourceDir, entryName))
    const entryFileName = path.basename(entryFilePath)

    const entry = {
      [entryName]: [entryFilePath]
    }

    return {
      entry,
      alias: initialConfig.alias || {},
      copy: initialConfig.copy || {},
      sourceRoot: sourceDirName,
      outputRoot: outputDirName,
      platform,
      babel: getBabelConfig(initialConfig.babel),
      csso: initialConfig.csso,
      sass: initialConfig.sass,
      uglify: initialConfig.uglify,
      plugins: initialConfig.plugins,
      projectName: initialConfig.projectName,
      isWatch: watch
    }
  }
}
