import _ from 'lodash';

export class TargetLabelRewriteDatasource {
  instanceSettings: any;
  $q: any;
  datasourceSrv: any;
  templateSrv: any;

  constructor(instanceSettings, $q, datasourceSrv, templateSrv) {
    this.instanceSettings = instanceSettings;
    this.$q = $q;
    this.datasourceSrv = datasourceSrv;
    this.templateSrv = templateSrv;
  }

  query(options) {
    var sets = _.groupBy(options.targets, 'datasource');
    var promises = _.map(sets, targets => {
      const dsName = targets[0].datasource;
      if (dsName === 'Target Label Rewrite') {
        return Promise.resolve([]);
      }

      const filtered = _.filter(targets, (t) => {
        return !t.hide;
      });

      if (filtered.length === 0) {
        return { data: [] };
      }

      return this.datasourceSrv.get(dsName).then(ds => {
        const opt = _.cloneDeep(options);
        opt.targets = filtered;
        return ds.query(opt).then((result) => {
          result.data.forEach((d) => {
            if (this.instanceSettings.jsonData && this.instanceSettings.jsonData[d.target]) {
              d.target = this.instanceSettings.jsonData[d.target];
            }
          });
          return result;
        });
      });
    });

    return Promise.all(promises).then(results => {
      return { data: _.flatten(_.map(results, 'data')) };
    });
  }

  testDatasource() {
    return this.$q.when({ status: "success", message: "Data source is working", title: "Success" });
  }
}
