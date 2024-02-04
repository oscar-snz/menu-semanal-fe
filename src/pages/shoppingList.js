import Head from 'next/head';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';



const Page = () => {

  <Head>
  <title>
    Lista de compras | MasterMenu
  </title>
</Head>

};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
