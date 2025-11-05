'use client';

import { Button } from "@/components/ui/button";
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from "@/components/ui/textarea";
import { Lightbulb, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { professionalSchema, ProfessionalFormData } from "@/schemas/professional/professional";
import {  useGetProfessionalbyUserId, useUpdateProfessionalbyUserId } from "@/hooks/useProfessional";
import { useRouter } from "next/navigation";
const EditIntroduction = () => {
  const router = useRouter()
  const { data: professional, isLoading: isFetching } = useGetProfessionalbyUserId();
  const mutation = useUpdateProfessionalbyUserId();
  const { handleSubmit, control, reset, formState: { errors } } = useForm<ProfessionalFormData>({
    resolver: zodResolver(professionalSchema),
    defaultValues: { introduction: '' },
  });

  useEffect(() => {
    if (professional) {
      reset({ introduction: professional.introduction });
    }
  }, [professional, reset]);

  const onSubmit = (formData: ProfessionalFormData) => {
    if (!professional) return;

    mutation.mutate({
      id: professional._id,
      data: formData,
    });
  };

  if (isFetching) return <div>Loading professional data...</div>;

  return (
    <div className="p-4">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Form Section */}
        <div className="flex-[2] p-4">
          <h1 className="font-bold text-xl mb-6">Edit Basic Information.</h1>
          <p className="font-semibold mb-2">Why should customers hire you?</p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
            <Controller
              name="introduction"
              control={control}
              render={({ field }) => (
                <>
                  <Textarea
                    {...field}
                    className="h-40"
                    placeholder="Explain what makes your business stand out and why you’ll do a great job."
                  />
                  {/* Display Zod validation errors */}
                  {errors.introduction && (
                    <p className="text-red-500 text-xs mt-1">{errors.introduction.message}</p>
                  )}
                </>
              )}
            />

            {/* Display server mutation errors */}
            {mutation.error && (
              <p className="text-red-500 text-xs mt-1">
                {mutation.error.message}
              </p>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <Button
                type="submit"
                className="bg-sky-500 text-white hover:bg-sky-600 dark:bg-sky-500 dark:hover:bg-sky-500 flex items-center gap-2"
                disabled={mutation.isPending}
              >
                {mutation.isPending && <Loader2 className="animate-spin w-4 h-4" />}
                {mutation.isPending ? 'Saving...' : 'Save'}
              </Button>

              <Button
                type="button"
                className="bg-transparent text-sky-500 hover:bg-transparent dark:bg-transparent dark:hover:bg-transparent border border-gray-200 dark:border-gray-700"
                onClick={()=>router.back()}
                disabled={mutation.isPending}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>

        {/* Tips Section */}
        <div className="flex-1 rounded bg-gray-100 dark:bg-gray-700 py-4 border border-gray-200 dark:border-gray-800 p-4 mt-4 lg:mt-0">
          <div className="flex flex-row gap-2 items-center mb-2">
            <Lightbulb className="w-4 h-4" />
            <p className="font-bold text-xs">Tips</p>
          </div>
          <p className="text-xs pl-6">
            This is one of the first things customers see about your business. Make sure to impress.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EditIntroduction;
