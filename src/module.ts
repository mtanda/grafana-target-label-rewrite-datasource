import { DataSource } from './datasource';
import { DataSourcePlugin } from '@grafana/data';
import { TargetLabelRewriteQuery, TargetLabelRewriteOptions } from './types';

export const plugin = new DataSourcePlugin<DataSource, TargetLabelRewriteQuery, TargetLabelRewriteOptions>(DataSource);
