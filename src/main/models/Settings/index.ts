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
    this.db.exec(createSettingsTable);
    this.initSettings();
  }

  initSettings() {
    const initialSettings = {
      theme: 'dark',
      lang: 'en',
      gymName: 'gym boss',
      subscriptions: JSON.stringify([]),
    };

    const stm = this.db.prepare(createQuery);
    stm.run(initialSettings);
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
