import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import SubCategoryForm from "@/components/it-services/forms/category/subcategory-form";
import { SubCategoryFormData } from "@/schemas/it-services/category";

interface CategoryDialogProps {
     isOpen: boolean;
     selectedSubCategory?: SubCategoryFormData | null;
     // eslint-disable-next-line
     onClose: (isSuccess : boolean) => void;
}
export default function UpsertSubCategoryDialog({ isOpen, selectedSubCategory, onClose } : CategoryDialogProps) {
    const handleOpenChange = (open: boolean) => {
        if (!open) onClose(false)
    }
    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-4xl">
                <DialogHeader>
                    <DialogTitle>{selectedSubCategory?.id ? "Edit Sub Category" : "Add Sub Category"}</DialogTitle>
                    <DialogDescription/>
                </DialogHeader>
                <SubCategoryForm onClose={() => onClose(true)} selectedCategory={selectedSubCategory}/>
            </DialogContent>
        </Dialog>
    )
}