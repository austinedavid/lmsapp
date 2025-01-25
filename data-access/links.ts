const useCheckLink = () => {
  const isHttp = (url: string) => {
    const regex =
      /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return regex.test(url);
  };
  return {
    isHttp,
  };
};

export default useCheckLink;
