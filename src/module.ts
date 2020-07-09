import { DataSource } from './datasource';
import { DataSourcePlugin, DataQuery, DataSourceJsonData } from '@grafana/data';

export const plugin = new DataSourcePlugin<DataSource, DataQuery, DataSourceJsonData>(DataSource);
