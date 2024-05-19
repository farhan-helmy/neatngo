export default function PaymentFailedPage() {
  return (
    <div className="xl:py-12 xl:px-72 py-4 px-2">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col my-2">
        <div className="mb-4">
          <h1 className="text-center text-2xl font-bold">Payment Failed</h1>
        </div>
        <div className="flex items-center justify-center">
          <p className="text-center">Your payment failed. Please try again.</p>
        </div>
      </div>
    </div>
  );
}
