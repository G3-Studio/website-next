export default function WorkshopEditComponentContainer({ children }: { children: any }) {
    return (
      <div className="flex flex-col w-full p-2 border-2 border-red-600 rounded-lg">
        {children}
      </div>
    );
  }