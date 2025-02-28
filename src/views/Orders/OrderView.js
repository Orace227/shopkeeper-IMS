import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { Container, Typography, Grid, Divider } from '@mui/material';
import { useParams } from 'react-router-dom';

export default function OrderView() {
  const [orderData, setOrderData] = useState(null);
  const [OneUser, setOneUser] = useState(null);
  let { orderId } = useParams();
  orderId = parseInt(orderId, 10);

  const getOrders = async () => {
    try {
      const response = await axios.get(`/GetOrders?orderId=${orderId}`);
      const orderData = response.data.existedOrders;
      console.log(orderData);
      for (const order of orderData) {
        for (const product of order.products) {
          try {
            console.log(product);
            const productResponse = await axios.get(`/GetProducts?productId=${product.productId}`);
            console.log(productResponse); // Assuming the quantity is in the response data
            const getProduct = productResponse.data.findProducts;
            // console.log(getProduct);
            product.availableQuantity = getProduct[0].quantityInStock;
            // console.log(product);
          } catch (error) {
            // Handle errors if the API request fails for a product
            console.error(`Error fetching quantity for product ${product.productId}:`, error);
          }
        }
      }

      const User = await axios.get(`/GetUser?cartId=${orderData[0].cartId}`);
      console.log(User.data.findEmployees);
      const oneUser = User.data.findEmployees[0];
      setOneUser(oneUser);
      // console.log({ orderData });
      const oneOrder = orderData[0];

      if (oneOrder) {
        console.log(oneOrder);
        setOrderData(oneOrder);
      } else {
        throw new Error('No Order found');
      }
    } catch (error) {
      console.error('Error fetching order', error);
      throw error;
    }
  };

  const getEmp = async () => {
    console.log('csnvjbsbsvjsvbsjb');
    console.log(orderData);
  };

  useEffect(() => {
    getOrders()
      .then(() => {
        toast.success('Order Fetched Successfully!!');
      })
      .catch(() => {
        toast.error('Failed to fetch Order!!!');
      })
      .finally(() => {
        toast.dismiss();
      });
    getEmp();
  }, []);

  //   const extractDate = (datetimeString) => {
  //     if (datetimeString) {
  //       const parts = datetimeString.split('T');
  //       if (parts.length > 0) {
  //         return parts[0];
  //       }
  //     }
  //     return '';
  //   };
  console.log(orderData);
  return (
    <>
      <Toaster />
      <Container maxWidth="md" style={{ padding: '17px' }}>
        <Typography variant="h4" align="center" style={{ fontSize: '30px', fontWeight: 'bold', marginBottom: '17px' }}>
          Order Details
        </Typography>
        {orderData && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h4" style={{ fontSize: '26px', fontWeight: 'bold', marginTop: '17px', marginBottom: '17px' }}>
                Title: {orderData.title}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" style={{ fontSize: '17px' }}>
                <strong>Order ID: </strong> {orderData.orderId}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" style={{ fontSize: '17px' }}>
                <strong>Employee Name: </strong> {OneUser?.username}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" style={{ fontSize: '17px' }}>
                <strong>Branch Name: </strong> {OneUser.dept}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body1" style={{ fontSize: '17px' }}>
                <strong>Email: </strong> {OneUser.email}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body1" style={{ fontSize: '17px' }}>
                <strong>Mobile No: </strong> {OneUser.mNumber}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" style={{ fontSize: '17px' }}>
                <div className="flex ">
                  <div className="font-bold">Status: </div>
                  <div
                    className={`p-1 -mt-1 ml-1 w-24 rounded-full text-center ${
                      orderData.Status === 'pending'
                        ? 'bg-yellow-200'
                        : orderData.Status === 'approved'
                        ? 'bg-green-200'
                        : orderData.Status === 'canceled'
                        ? 'bg-red-200'
                        : orderData.Status === 'attended'
                        ? 'bg-blue-200'
                        : ''
                    }`}
                  >
                    {orderData.Status}
                  </div>
                </div>
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider style={{ marginTop: '20px' }}>
                {' '}
                <Typography variant="body1" style={{ fontSize: '22px' }}>
                  <strong>Products</strong>
                </Typography>
              </Divider>
            </Grid>
            <Grid container spacing={2} className="mt-2">
              {orderData.products.map((product, index) => (
                <Grid item xs={12} sm={6} key={product._id.$oid}>
                  <div className="bg-white border border-gray-300 rounded p-4 shadow-md">
                    <Typography variant="h6" className="text-lg font-bold mb-2">
                      Product Name: {product.productName}
                    </Typography>
                    <Typography variant="body1" className="text-base text-gray-500 mb-2">
                      <strong>Category:</strong> {product.category}
                    </Typography>
                    <Typography variant="body1" className="text-base text-gray-500 mb-2">
                      <strong>Description:</strong> {product.description}
                    </Typography>
                    <Typography variant="body1" className="text-base text-gray-500 mb-2">
                      <div className="flex gap-10 my-2">
                        <div>
                          <strong>Quantity:</strong> {product.actualQuantity}
                        </div>
                        {product.Status == 'pending' && (
                          <div>
                            <strong>Available Quantity:</strong> {product.availableQuantity}
                          </div>
                        )}
                      </div>
                    </Typography>
                    {product.Status !== 'canceled' && product.Status !== 'pending' && (
                      <Typography variant="body1" className="text-base text-gray-500 mb-2">
                        <strong>approvedQuantity:</strong> {product.updatedQuantity}
                      </Typography>
                    )}

                    <Typography variant="body1" style={{ fontSize: '17px' }}>
                      <div className="flex text-base text-gray-500 mb-2">
                        <strong className="">Status: </strong>
                        <div
                          className={` ml-1 w-24 rounded-full text-center ${
                            product.Status === 'pending'
                              ? 'bg-yellow-200'
                              : product.Status === 'approved'
                              ? 'bg-green-200'
                              : product.Status === 'canceled'
                              ? 'bg-red-200'
                              : ''
                          }`}
                        >
                          {product.Status}
                        </div>
                      </div>
                    </Typography>
                    {product?.remarks && (
                      <Typography variant="body1" className="text-base  text-gray-500">
                        <strong>Remark:</strong>
                        <div className="w-[200px]">{product.remarks}</div>
                      </Typography>
                    )}
                  </div>
                  {(index + 1) % 2 === 0 && <div style={{ width: '100%', clear: 'both' }}></div>}
                </Grid>
              ))}
            </Grid>
          </Grid>
        )}
      </Container>
    </>
  );
}
