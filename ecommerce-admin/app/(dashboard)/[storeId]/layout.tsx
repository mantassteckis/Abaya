import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import prismadb from "@/lib/prismadb";
import Navbar from "@/components/navbar";

// Function to check if a string is a valid MongoDB ObjectId
function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeId: string };
}) {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Check if storeId is a valid ObjectId before querying
  if (!isValidObjectId(params.storeId)) {
    redirect("/");
  }

  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
      userId,
    },
  });

  if (!store) {
    redirect("/");
  }

const stores = await prismadb.store.findMany({
    where: {
      userId,
    },
  });

  return (
    <>
      <div>
        <Navbar items={stores} />
        {children}
      </div>
    </>
  );
}
