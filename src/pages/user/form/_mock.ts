export default {
  'POST  /api/forms': (req: any, res: any) => {
    res.send({ message: 'Ok' });
  },
  fields: [
    {
       key: 'title',
       type: 'input',
       dataIndex: 'title',
    },
    {
       key: 'name',
       type: 'input',
       dataIndex: 'name',
    },
    {
       key: 'job',
       type: 'input',
       dataIndex: 'job',
    },
    {
       key: 'country',
       type: 'input',
       dataIndex: 'country',
    },
  ],
};
