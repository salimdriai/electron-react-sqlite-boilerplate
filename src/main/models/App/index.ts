import DB from '../../db';
import { getQuery, createAppTable, createQuery, updateQuery } from './queries';
import { LicenseData } from '../../../types';
import { decryptData, encryptData } from '../../utils/Encription';
import { SECRET_IV, SECRET_KEY } from '../../config/keys';

export default class AppModel extends DB {
  private db: any;

  constructor() {
    super();
    this.db = super.connect();
    this.db.exec(createAppTable);
  }

  getLicense(): LicenseData {
    const stm = this.db.prepare(getQuery);
    const license = stm.all();
    const data = decryptData(license[0].license, SECRET_KEY, SECRET_IV);
    return JSON.parse(data);
  }

  initLicense(): LicenseData {
    const getStm = this.db.prepare(getQuery);
    const existing = getStm.all();

    if (existing.length) {
      const data = decryptData(existing[0].license, SECRET_KEY, SECRET_IV);
      return JSON.parse(data);
    }

    const data: LicenseData = {
      key: '',
      hddsn: '',
      clientName: '',
      phoneNumber: '',
      isActive: true,
    };

    const encryptedData = encryptData(
      JSON.stringify(data),
      SECRET_KEY,
      SECRET_IV
    );

    const license = JSON.stringify(encryptedData);
    const stm = this.db.prepare(createQuery);
    stm.run({ id: 0, license });
    return data;
  }

  updateLicense(licenseData: LicenseData) {
    const license = encryptData(
      JSON.stringify(licenseData),
      SECRET_KEY,
      SECRET_IV
    );
    const stm = this.db.prepare(updateQuery);
    stm.run({ id: 0, license });
    return { success: true };
  }
}
