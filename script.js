
    AWS.config.update({
      region: 'Your-region', // Replace with your AWS region
      accessKeyId: 'Your-access-key-ID', // Replace with your AWS access key
      secretAccessKey: 'Your-secret access-key-ID', // Replace with your AWS secret key
    });
    
const checkboxes = document.querySelectorAll('.item-checkbox');
const orderButton = document.querySelector('.order-button');

const selectedItems = [];

checkboxes.forEach(checkbox => {
  checkbox.addEventListener('change', function () {
    const itemDescription = this.nextElementSibling.textContent;
    const itemPrice = this.getAttribute('data-price');
    
    if (this.checked) {
      selectedItems.push({ description: itemDescription, price: itemPrice });
    } else {
      const index = selectedItems.findIndex(item => item.description === itemDescription);
      if (index !== -1) {
        selectedItems.splice(index, 1);
      }
    }
  });
});

orderButton.addEventListener('click', function () {
  if (selectedItems.length > 0) {
    let totalPrice = 0;
    let orderSummary = 'Selected items:\n';
    selectedItems.forEach(item => {
      orderSummary += `${item.description} - $${item.price}\n`;
      totalPrice += parseFloat(item.price);
    });
    orderSummary += `Total Price: $${totalPrice.toFixed(2)}`;
    
    

    // Publish the order summary to the AWS SNS topic
    
    AWS.config.update({ region: 'ap-south-1' }); // Replace with your AWS region
    const sns = new AWS.SNS();

    const snsParams = {
      TopicArn: 'arn:aws:sns:ap-south-1:489978204301:rest_menu', // Replace with your SNS topic ARN
      Message: orderSummary,
    };

    sns.publish(snsParams, (err, data) => {
      if (err) {
        console.error('Error publishing message:', err);
      } else {
        console.log('Message published:', data);
        alert('Order placed successfully!');
      }
    });

  } else {
    alert('No items selected.');
  }
});
