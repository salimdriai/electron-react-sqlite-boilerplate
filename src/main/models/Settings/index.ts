import { Settings } from 'types/settings';
import DB from '../../db';
import { getQuery, updateQuery } from './queries';

export default class SettingsModel extends DB {
  private db: any;

  constructor() {
    super();
    this.db = super.connect();
  }

  get(): Settings[] {
    const stm = this.db.prepare(getQuery);
    const settings = stm.all()[0];
    settings.subscriptions = JSON.parse(settings.subscriptions);

    return settings;
  }

  update(settings: Settings) {
    const stm = this.db.prepare(updateQuery);
    settings.subscriptions = JSON.stringify(settings.subscriptions) as any;
    stm.run(settings);
  }
}
