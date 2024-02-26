import { Settings } from 'types/settings';
import DB from '../../db';
import {
  getQuery,
  createQuery,
  updateQuery,
  createSettingsTable,
} from './queries';

export default class SettingsModel extends DB {
  private db: any;

  constructor() {
    super();
    this.db = super.connect();
    this.initSettings();
  }

  async initSettings() {
    try {
      await this.db.exec(createSettingsTable);
      const initialSettings = {
        theme: 'dark',
        lang: 'en',
        gymName: 'Flex Fit',
        subscriptions: JSON.stringify([]),
      };

      const stm = this.db.prepare(createQuery);
      stm.run(initialSettings);
    } catch (err) {
      console.error('FAILED TO INIT SETTINGS', err);
    }
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
