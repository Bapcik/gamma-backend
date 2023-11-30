import { Express } from 'express';
import validateResource from '../../../middlewares/validateResource';
import { therapyMethodSchema } from '../../schema/therapyMethod';
function routes(app: Express) {
  /**
   * @openapi
   * /methods/create:
   *   post:
   *     tags:
   *       - Therapy Method
   *     summary: Adding therapies
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/PostTherapyMethod'
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/PostTherapyMethod'
   *       400:
   *         description: Bad request
   */

  app.post('/methods/create', validateResource(therapyMethodSchema));

  /**
   * @openapi
   * /methods:
   *   get:
   *     tags:
   *       - Therapy Method
   *     summary: Receiving all therapy methods
   *     responses:
   *       200:
   *         description: Success
   *       400:
   *         description: Bad request
   */

  app.get('/methods', validateResource(therapyMethodSchema));

  /**
   * @openapi
   * /methods/{id}:
   *   get:
   *     tags:
   *       - Therapy Method
   *     summary: Receiving all therapy methods
   *     parameters:
   *     - name: id
   *       in: path
   *       required: true
   *     responses:
   *       200:
   *         description: Success
   *       400:
   *         description: Bad request
   */

  app.get('/methods/:id', validateResource(therapyMethodSchema));
}
export default routes;
