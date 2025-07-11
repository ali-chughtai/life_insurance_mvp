import express from 'express';
import { body, validationResult } from 'express-validator';
import { Op, Sequelize } from 'sequelize'; 
import { InsuranceProduct } from '../models';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.post('/', [
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

    const { age, income, dependents, risk_tolerance } = req.body;

    const matchingProducts = await InsuranceProduct.findAll({
      where: {
        min_age: { [Op.lte]: age },
        max_age: { [Op.gte]: age },
        suitable_risk_tolerance: risk_tolerance,
        
        [Op.and]: [
          {
            min_income: {
              [Op.or]: [
                { [Op.is]: Sequelize.literal('NULL') }, 
                { [Op.lte]: income }
              ]
            }
          },
          {
            max_income: {
              [Op.or]: [
                { [Op.is]: Sequelize.literal('NULL') }, 
                { [Op.gte]: income }
              ]
            }
          },
          {
            max_dependents: {
              [Op.or]: [
                { [Op.is]: Sequelize.literal('NULL') }, 
                { [Op.gte]: dependents }
              ]
            }
          }
        ]
      },
      order: [['coverage_amount', 'DESC']],
      limit: 3,
    });

    if (matchingProducts.length === 0) {
      return res.json({
        recommendation: null,
        message: 'No suitable insurance products found for your profile. Please contact our agents for personalized assistance.'
      });
    }

    const primaryRecommendation = matchingProducts[0];

    const explanation = generateExplanation(primaryRecommendation, { age, income, dependents, risk_tolerance });

    res.json({
      recommendation: {
        product_name: primaryRecommendation.product_name,
        product_type: primaryRecommendation.product_type,
        coverage_amount: primaryRecommendation.coverage_amount,
        term_length: primaryRecommendation.term_length,
        monthly_premium: primaryRecommendation.monthly_premium,
        description: primaryRecommendation.description,
        features: primaryRecommendation.features,
        explanation
      },
      alternatives: matchingProducts.slice(1).map(product => ({
        product_name: product.product_name,
        product_type: product.product_type,
        coverage_amount: product.coverage_amount,
        term_length: product.term_length,
        monthly_premium: product.monthly_premium,
        description: product.description
      }))
    });
  } catch (error) {
    console.error('Recommendation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

function generateExplanation(product: any, userProfile: any): string {
  const { age, income, dependents, risk_tolerance } = userProfile;
  
  let explanation = `Based on your profile (Age: ${age}, Income: $${income.toLocaleString()}, Dependents: ${dependents}, Risk Tolerance: ${risk_tolerance}), `;
  
  if (product.product_type === 'Term Life') {
    explanation += `we recommend ${product.product_name} because term life insurance provides high coverage at an affordable cost, which is ideal for `;
    
    if (age < 35) {
      explanation += 'young adults building their financial foundation. ';
    } else if (age < 50) {
      explanation += 'individuals in their peak earning years with family responsibilities. ';
    } else {
      explanation += 'those approaching retirement who still have financial obligations. ';
    }
    
    if (dependents > 0) {
      explanation += `With ${dependents} dependent(s), this coverage ensures your family's financial security. `;
    }
  } else if (product.product_type === 'Whole Life') {
    explanation += `we recommend ${product.product_name} because whole life insurance provides permanent coverage with cash value accumulation, which aligns with your `;
    
    if (risk_tolerance === 'Low') {
      explanation += 'conservative risk profile and need for guaranteed benefits. ';
    } else {
      explanation += 'desire for both protection and investment growth. ';
    }
  }
  
  explanation += `The monthly premium of $${product.monthly_premium} represents approximately ${((product.monthly_premium * 12) / income * 100).toFixed(1)}% of your annual income, which is within recommended guidelines.`;
  
  return explanation;
}

export default router;