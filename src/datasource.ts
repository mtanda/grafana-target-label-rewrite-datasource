import _ from 'lodash';
import { DataSourceApi, DataSourceInstanceSettings } from '@grafana/data';
import { TargetLabelRewriteQuery, TargetLabelRewriteOptions } from './types';

export class DataSource extends DataSourceApi<TargetLabelRewriteQuery, TargetLabelRewriteOptions> {
  instanceSettings: any;
  datasourceSrv: any;

  /** @ngInject */
  constructor(instanceSettings: DataSourceInstanceSettings<TargetLabelRewriteOptions>, datasourceSrv) {
    super(instanceSettings);
    this.instanceSettings = instanceSettings;
    this.datasourceSrv = datasourceSrv;
  }

  async query(options) {
    const sets = _.groupBy(options.targets, 'datasource');
    const promises = _.map(sets, async targets => {
      const dsName = targets[0].datasource;
      if (dsName === 'Target Label Rewrite') {
        return [];
      }

      const filtered = _.filter(targets, t => {
        return !t.hide;
      });

      if (filtered.length === 0) {
        return { data: [] };
      }

      const ds = await this.datasourceSrv.get(dsName);
      const opt = _.cloneDeep(options);
      opt.targets = filtered;
      let result = await ds.query(opt);
      result.data.forEach(d => {
        if (this.instanceSettings.jsonData && this.instanceSettings.jsonData[d.target]) {
          d.target = this.instanceSettings.jsonData[d.target];
        }
      });
      return result;
    });

    const results = await Promise.all(promises);
    return { data: _.flatten(_.map(results, 'data')) };
  }

  async testDatasource() {
    return { status: 'success', message: 'Data source is working', title: 'Success' };
  }
}
