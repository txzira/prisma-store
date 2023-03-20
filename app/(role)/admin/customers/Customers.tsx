import { User } from "@prisma/client";
import { verify } from "crypto";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function CustomerTable({
  setCustomer,
  data,
  isLoading,
}: {
  setCustomer: React.Dispatch<React.SetStateAction<User>>;
  data: any;
  isLoading: boolean;
}) {
  return (
    <table className="border-2 border-black text-center">
      <tr className="bg-black text-white">
        <th className="p-3">Id</th>
        <th className="p-3">Email</th>
        <th className="p-3">First Name</th>
        <th className="p-3">Last Name</th>
        <th className="p-3">Role</th>
        <th className="p-3">Verified</th>
      </tr>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        data &&
        data.customers.map((customer) => {
          return (
            <tr key={customer.id} className="hover:bg-white" onClick={() => setCustomer(customer)}>
              <td className="p-2">{customer.id}</td>
              <td className="p-2">{customer.email}</td>
              <td className="p-2">{customer.firstName}</td>
              <td className="p-2">{customer.lastName}</td>
              <td className="p-2">{customer.role}</td>
              <td className="p-2">{customer.verified ? "yes" : "no"}</td>
            </tr>
          );
        })
      )}
      <tr>
        <td className="p-2">
          <button>&lt;-</button>
        </td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td className="p-2">
          <button>-&gt;</button>
        </td>
      </tr>
    </table>
  );
}

export function CustomerDetails({ customer, mutate }: { customer: User; mutate: any }) {
  const [show, setShow] = useState(false);

  function CustomerField({ title, value }) {
    return (
      <div>
        <span>{title}:</span>
        <span>{value}</span>
      </div>
    );
  }
  const verifyCustomer = async (id, status) => {
    const response = await fetch("/admin/customers/verify-customer", {
      method: "POST",
      body: JSON.stringify({ id, verify: status }),
    });
    const message = await response.json();
    mutate();
    console.log(message);
  };

  console.log(customer);
  return customer ? (
    <div>
      {show && <DeleteConfirmationModal setShow={setShow} mutate={mutate} customerId={customer.id} />}
      <CustomerField title="Id" value={customer.id} />
      <CustomerField title="Email" value={customer.email} />
      <CustomerField title="First Name" value={customer.firstName} />
      <CustomerField title="Last Name" value={customer.lastName} />
      <CustomerField title="Role" value={customer.role} />
      <CustomerField title="Verification Status" value={customer.verified ? "Approved" : "Awaiting Approval"} />
      <button
        className={`rounded-full border-black border-2 p-2 hover:text-white ${
          customer.verified ? "hover:bg-yellow-400 " : "hover:bg-green-600"
        }`}
        onClick={() => verifyCustomer(customer.id, customer.verified)}
      >
        {customer.verified ? "Cancel Membership" : "Approve Membership"}
      </button>
      <button className="rounded-full border-black border-2 p-2 hover:bg-red-700 hover:text-white" onClick={() => setShow(true)}>
        Delete Customer
      </button>
    </div>
  ) : (
    <div>
      <CustomerField title="Id" value="" />
      <CustomerField title="Email" value="" />
      <CustomerField title="First Name" value="" />
      <CustomerField title="Last Name" value="" />
      <CustomerField title="Role" value="" />
      <CustomerField title="Verification Status" value="" />
    </div>
  );
}

function DeleteConfirmationModal({
  setShow,
  customerId,
  mutate,
}: {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  customerId: number;
  mutate: any;
}) {
  const deleteCustomer = async () => {
    toast.loading("Loading...");
    const response = await fetch(`/admin/customers/delete-customer/${customerId}`, {
      method: "DELETE",
    });
    const json = await response.json();
    console.log(json);
    mutate();
    toast.dismiss();
    if (json.status === 200) toast.success(json.message);
    else {
      toast.error(json.message);
    }
    setShow(false);
    window.location.reload();
  };

  function closeOnEscKeyDown(event) {
    if ((event.charCode || event.keyCode) === 27) {
      setShow(false);
    }
  }
  useEffect(() => {
    document.body.addEventListener("keydown", closeOnEscKeyDown);
    return function cleanup() {
      document.body.removeEventListener("keydown", closeOnEscKeyDown);
    };
  }, []);

  return (
    <div
      className="flex fixed bg-opacity-50 top-0 left-0 right-0 p-4 overflow-x-hidden overflow-y-auto bg-black w-full md:h-full md:inset-0 h-[calc(100%-1rem)] z-50 "
      onClick={() => setShow(false)}
    >
      <div className="relative w-1/3 h-full max-w-2xl md:h-auto m-auto " onClick={(e) => e.stopPropagation()}>
        <div className=" flex flex-col items-center relative bg-white rounded-lg shadow dark:bg-gray-700 ">
          <h1 className="text-lg p-2">Are you sure you wanted to delete this user? This action is irreversible.</h1>
          <div className="flex flex-row gap-8 p-2">
            <button
              className=" p-2 rounded-full border-2 text-lg border-black bg-gray-400 text-white hover:shadow-lg hover:-translate-y-2 "
              onClick={() => setShow(false)}
            >
              Cancel
            </button>
            <button
              className=" p-2 rounded-full border-2 text-lg border-black bg-red-600 text-white hover:shadow-lg hover:-translate-y-2"
              onClick={() => deleteCustomer()}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
