import express from 'express';

const { Router } = express;

const apiRouter = Router();

// 404 supports
apiRouter.use((req, res) => {
  res.status(404).json({
    message: 'Not found',
    status: 404,
  });
});

export default apiRouter;
