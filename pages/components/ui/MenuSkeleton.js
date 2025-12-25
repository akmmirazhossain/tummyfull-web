export default function MenuSkeleton() {
  return (
    <div>
      <div className="flex items-center justify-between h1_akm">
        <Skeleton className="h-8 rounded-xl w-36 lg:h-10 lg:w-64"></Skeleton>
        <Skeleton className="w-20 h-8 rounded-xl lg:h-10 lg:w-24"></Skeleton>
      </div>
      <div className="grid grid-cols-2 gap_akm">
        {[1, 2].map((item) => (
          <Card key={item} className="mb-6">
            <div className="my-2 pad_akm">
              <Skeleton className="w-16 h-4 ml-2 rounded-xl lg:h-8 lg:w-28 lg:ml-3"></Skeleton>
            </div>
            <div className="flex items-center justify-center h-60 lg:h-[440px] border-y-1">
              <div>
                <div className="flex justify-center gap_akm">
                  <Skeleton className="w-16 h-16 rounded-full lg:h-32 lg:w-32"></Skeleton>
                  <Skeleton className="w-16 h-16 rounded-full lg:h-32 lg:w-32"></Skeleton>
                </div>
                <div className="flex items-center justify-center">
                  <Skeleton className="rounded-full h-28 w-28 lg:h-44 lg:w-44"></Skeleton>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap_akm pad_akm">
              <div className="flex flex-col items-center justify-center mb-2 gap_akm">
                <Skeleton className="w-16 h-6 rounded-xl lg:h-10 lg:w-28"></Skeleton>
                <Skeleton className="w-20 h-2 rounded-xl lg:h-8 lg:w-36"></Skeleton>
                <Skeleton className="w-20 h-2 rounded-xl lg:h-8 lg:w-36"></Skeleton>
              </div>
              <div className="flex flex-col items-center justify-center gap_akm">
                <Skeleton className="w-24 h-16 rounded-full lg:h-20 lg:w-36"></Skeleton>
                <Skeleton className="w-16 h-2 rounded-full lg:h-4 lg:w-28"></Skeleton>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
