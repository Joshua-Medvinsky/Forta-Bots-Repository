/// <reference types="node" />
import fs from 'fs';
import shelljs from 'shelljs';
import prompts from 'prompts';
import { CommandHandler } from '../..';
import { InitKeystore } from '../../utils/init.keystore';
import { InitConfig } from '../../utils/init.config';
import { InitKeyfile } from '../../utils/init.keyfile';
export default function provideInit(shell: typeof shelljs, prompt: typeof prompts, filesystem: typeof fs, contextPath: string, initKeystore: InitKeystore, initConfig: InitConfig, initKeyfile: InitKeyfile, args: any): CommandHandler;
