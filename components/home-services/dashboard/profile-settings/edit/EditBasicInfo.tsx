"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useLocationByUserId } from "@/hooks/useLocation";
import { useGetProfessionalbyUserId, useUpdateProfessional } from "@/hooks/useProfessional";
import { UpdateProfessionalIntroSchema } from "@/schemas/professional/professional";
import { Pencil, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type PaymentMethod = "Cash" | "Apple Pay" | "Paypal" | "Stripe" | "Zelle";
const paymentOptions: PaymentMethod[] = ["Cash", "Apple Pay", "Paypal", "Stripe", "Zelle"];

const EditBasicInfo = () => {
  const { data: pro, isLoading, isError, refetch, error } = useGetProfessionalbyUserId();
  const {
    data: location,
    isLoading: isLoadingLocation,
    isError: isErrorLocation,
    refetch: refetchLocation,
    error: locationError,
  } = useLocationByUserId();

  const { mutate: updatePro, isPending } = useUpdateProfessional();
  const [retrying, setRetrying] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(UpdateProfessionalIntroSchema),
    defaultValues: {
      business_name: "",
      founded_year: undefined,
      employees: undefined,
      website: "",
      address_line: "",
      zipcode: "",
      payment_methods: [],
      profile_image: null,
    },
  });

  // Reset form when professional or location data changes
  useEffect(() => {
    if (pro || location) {
      reset({
        business_name: pro?.business_name || "",
        founded_year: pro?.founded_year || "",
        employees: pro?.employees || "",
        website: pro?.website || "",
        address_line: location?.address_line || "",
        zipcode: location?.zipcode || "",
        payment_methods: pro?.payment_methods || [],
        profile_image: null,
      });
      setPreviewImage(pro?.profile_image || null);
    }
  }, [pro, location, reset]);

  // Watch profile image input to update preview
  const watchedImage = watch("profile_image");
  useEffect(() => {
    if (watchedImage && watchedImage.length > 0 && watchedImage[0] instanceof File) {
      const file = watchedImage[0];
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  }, [watchedImage]);

  const onSubmit = (values: any) => {
    const formData = {
      ...values,
      profile_image: values.profile_image?.[0] || pro?.profile_image,
    };
    updatePro(
      { id: pro?._id, data: formData },
      {
        onSuccess: () => {
          refetch();
          refetchLocation();
        },
      }
    );
  };

  // ------------------------------
  // Loading Skeleton
  // ------------------------------
  if (isLoading || isLoadingLocation || retrying) {
    return (
      <div className="max-w-6xl mx-auto p-4 space-y-5 animate-pulse">
        <div className="h-6 bg-gray-300 rounded w-32"></div>
        <div className="h-6 bg-gray-300 rounded w-64"></div>
        <div className="h-40 bg-gray-200 rounded"></div>
      </div>
    );
  }

  // ------------------------------
  // Error State
  // ------------------------------
  if (isError || isErrorLocation) {
    return (
      <div className="max-w-6xl mx-auto p-4 text-center">
        <p className="text-red-600 font-semibold mb-2">
          Oops! Something went wrong while fetching your profile or location.
        </p>
        <p className="text-gray-500 mb-4">
          Please check your internet connection or try again later.
        </p>
        {error?.message && <p className="text-gray-400 text-sm mb-2">Profile Error: {error.message}</p>}
        {locationError?.message && (
          <p className="text-gray-400 text-sm mb-4">Location Error: {locationError.message}</p>
        )}
        <Button
          disabled={retrying}
          onClick={async () => {
            setRetrying(true);
            await refetch();
            await refetchLocation();
            setRetrying(false);
          }}
          className="bg-sky-500 text-white hover:bg-sky-600"
        >
          {retrying ? "Retrying..." : "Retry"}
        </Button>
      </div>
    );
  }

  return (
    <div className="p-2 md:p-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1 className="font-bold text-xl mb-4 md:mb-6">Edit Basic Information</h1>

        {/* Profile Photo */}
        <div className="mt-4">
          <p className="text-sm font-semibold">Profile Photo</p>
          <div className="relative w-fit mt-2">
            {previewImage ? (
              <Image
                src={previewImage}
                width={100}
                height={100}
                alt="profile image"
                className="w-24 h-24 rounded-lg object-cover"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-200 rounded-lg" />
            )}
            <span className="p-1 rounded-lg bg-white absolute top-0 right-0 border cursor-pointer">
              <label htmlFor="upload-profile" className="cursor-pointer">
                <Pencil className="w-4 h-4" />
              </label>
              <input
                type="file"
                id="upload-profile"
                accept="image/png, image/jpeg"
                {...register("profile_image")}
                className="hidden"
              />
            </span>
          </div>
          <p className="text-xs text-red-500 mt-1">{errors.profile_image?.message?.toString()}</p>
        </div>

        {/* Business Name */}
        <div className="mt-4">
          <label className="text-sm font-semibold">Business Name</label>
          <Input type="text" {...register("business_name")} />
          <p className="text-xs text-red-500 mt-1">{errors.business_name?.message}</p>
        </div>

        {/* Year Founded */}
        <div className="mt-4">
          <label className="text-sm font-semibold">Year Founded</label>
          <Input type="text" {...register("founded_year", { valueAsNumber: true })} />
          <p className="text-xs text-red-500 mt-1">{errors.founded_year?.message}</p>
        </div>

        {/* Employees */}
        <div className="mt-4">
          <label className="text-sm font-semibold">Number of Employees</label>
          <Input type="text" {...register("employees", { valueAsNumber: true })} />
          <p className="text-xs text-red-500 mt-1">{errors.employees?.message}</p>
        </div>

        {/* Website */}
        <div className="mt-4">
          <label className="text-sm font-semibold">Website</label>
          <Input type="text" {...register("website")} />
          <p className="text-xs text-red-500 mt-1">{errors.website?.message}</p>
        </div>

        {/* Address */}
        <div className="mt-4">
          <label className="text-sm font-semibold">Address</label>
          <Input type="text" {...register("address_line")} />
          <p className="text-xs text-red-500 mt-1">{errors.address_line?.message}</p>
        </div>

        {/* Zipcode */}
        <div className="mt-4">
          <label className="text-sm font-semibold">Zip Code</label>
          <Input type="text" {...register("zipcode")} />
          <p className="text-xs text-red-500 mt-1">{errors.zipcode?.message}</p>
        </div>

        {/* Payment Methods */}
        <div className="mt-6">
          <p className="text-lg font-semibold">Payment Methods Accepted</p>
          <div className="grid grid-cols-2 gap-2 mt-3">
            {paymentOptions.map((method) => (
              <Controller
                key={method}
                control={control}
                name="payment_methods"
                render={({ field }) => (
                  <label className="flex items-center gap-2">
                    <Checkbox
                      checked={field.value.includes(method)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          field.onChange([...field.value, method]);
                        } else {
                          field.onChange(field.value.filter((v: PaymentMethod) => v !== method));
                        }
                      }}
                    />
                    {method}
                  </label>
                )}
              />
            ))}
          </div>
          <p className="text-xs text-red-500 mt-1">{errors.payment_methods?.message}</p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" type="button">
            <Link href="/home-services/dashboard/profile-settings">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isPending} className="bg-sky-500 text-white">
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditBasicInfo;
