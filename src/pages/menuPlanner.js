import Head from 'next/head';

import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';


const Page = () => (
  
    <Head>
      <title>
        MasterMenu | Planificador de Menu
      </title>
    </Head>
);   

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;