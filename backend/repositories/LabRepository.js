import { LabTest, LabReport, Patient, User } from '../models/index.js';

class LabRepository {
  async findTestById(id) {
    return await LabTest.findByPk(id);
  }

  async findReportByTestId(labTestId) {
    return await LabReport.findOne({ where: { labTestId } });
  }

  async findAllTests(where = {}) {
    return await LabTest.findAll({
      where,
      include: [
        { model: Patient, as: 'patient', include: [{ model: User, as: 'user', attributes: ['name'] }] },
        { model: User, as: 'doctor', attributes: ['name'] },
        { model: LabReport, as: 'report' },
      ],
    });
  }

  async createLabRequest(labRequestData) {
    return await LabTest.create(labRequestData);
  }

  async createLabReport(labReportData) {
    return await LabReport.create(labReportData);
  }

  async updateLabTest(id, updateData) {
    const test = await LabTest.findByPk(id);
    if (!test) return null;
    return await test.update(updateData);
  }
}

export default new LabRepository();
