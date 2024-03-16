import { Alert } from "react-native";

const alertErrors = (err) => {
  console.log(err.networkError.result);
  const message = err.networkError.result.errors[0].message;
  let messages = ``;
  const arrayOfMessage = message.split(",");

  if (Array.isArray(arrayOfMessage)) {
    arrayOfMessage.forEach((el) => (messages += el + "\n"));
    console.log(messages);
  } else {
    messages = message;
  }

  Alert.alert(err.networkError.result.errors[0].code, messages);
};

export default alertErrors;
