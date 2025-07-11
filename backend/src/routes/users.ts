import express from 'express';
import { body, validationResult } from 'express-validator';
import { UserData } from '../models';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    const userDataRecord = await UserData.findOne({
      where: { user_id: userId },
      order: [['updated_at', 'DESC']],
    });

    if (!userDataRecord) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    res.json({
      profile: {
        age: userDataRecord.age,
        income: userDataRecord.income,
        dependents: userDataRecord.dependents,
        risk_tolerance: userDataRecord.risk_tolerance,
        created_at: userDataRecord.created_at,
        updated_at: userDataRecord.updated_at
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/profile', [
  authenticateToken,
  body('age').isInt({ min: 18, max: 100 }).withMessage('Age must be between 18 and 100'),
  body('income').isFloat({ min: 0 }).withMessage('Income must be a positive number'),
  body('dependents').isInt({ min: 0 }).withMessage('Dependents must be a non-negative integer'),
  body('risk_tolerance').isIn(['Low', 'Medium', 'High']).withMessage('Risk tolerance must be Low, Medium, or High'),
], async (req: any, res: any) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = (req as any).user.userId;
    const { age, income, dependents, risk_tolerance } = req.body;

    const userDataRecord = await UserData.create({
      user_id: userId,
      age,
      income,
      dependents,
      risk_tolerance,
    });

    res.json({
      message: 'Profile updated successfully',
      profile: {
        age: userDataRecord.age,
        income: userDataRecord.income,
        dependents: userDataRecord.dependents,
        risk_tolerance: userDataRecord.risk_tolerance,
        created_at: userDataRecord.created_at,
        updated_at: userDataRecord.updated_at
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
