import { useEffect, useState } from 'react';

// material-ui
import { Grid } from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';
// project imports
import PopularCard from './PopularCard';
import TotalGrowthBarChart from './TotalGrowthBarChart';
import { gridSpacing } from 'store/constant';
// import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import TotalPendingCard from './TotalPendingCard';
import TotalProductCard from './TotalProductCard';
import TotalCategoryCard from './TotalCategoryCard';
// ==============================|| DEFAULT DASHBOARD ||============================== //
const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(true);
  const handleNotification = async () => {
    try {
      const isMin = await axios.get('/CheckMinLimit');
      if (isMin.data.min) {
        for (const product of isMin.data.findProducts) {
          let Message = `Stock amount of ${product.productName} (${product.productId}) is reduced!!`;
          toast.error(Message, {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
            onClick: () => {
              navigate('/Products');
            }
          });
        }
      }
      const Notification = await axios.get('/GetOrders?Status=pending');
      console.log(Notification.data.existedOrders);
      const NotificationArr = Notification.data.existedOrders;
      if (NotificationArr.length > 0) {
        let Message = `${NotificationArr.length} Order is pending`;
        toast.error(Message, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
          onClick: () => {
            navigate('/PendingOrders');
          }
        });
        NotificationArr.forEach((element) => {
          if (element.Status !== 'pending') {
            element.ShopkeeperNotification = false;
            const offNotification = axios.post('/UpdateOrder', element);
            if (offNotification) {
              console.log(offNotification);
            }
          }
        });
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    setLoading(false);
    handleNotification();
  }, []);

  return (
    <>
      {/* <Toaster /> */}
      <ToastContainer />
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid item lg={4} md={6} sm={6} xs={12}>
              <TotalPendingCard isLoading={isLoading} />
            </Grid>

            <Grid item lg={4} md={6} sm={6} xs={12}>
              <TotalProductCard isLoading={isLoading} />
            </Grid>
            <Grid item lg={4} md={6} sm={6} xs={12}>
              <TotalCategoryCard isLoading={isLoading} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12} md={8}>
              <TotalGrowthBarChart isLoading={isLoading} />
            </Grid>
            <Grid item xs={12} md={4}>
              <PopularCard isLoading={isLoading} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Dashboard;
