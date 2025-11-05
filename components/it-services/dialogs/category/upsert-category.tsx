import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import CategoryForm from "@/components/it-services/forms/category/category-form";
import { CategoryFormData } from "@/types/it-services/category";

interface CategoryDialogProps {
     isOpen: boolean;
     selectedCategory?: CategoryFormData | null;
     // eslint-disable-next-line
     onClose: (isSuccess : boolean) => void;
}
export default function UpsertCategory({ isOpen, selectedCategory, onClose } : CategoryDialogProps) {
    const handleOpenChange = (open: boolean) => {
        if (!open) onClose(false)
    }
    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-4xl">
                <DialogHeader>
                    <DialogTitle>{selectedCategory?.id ? "Edit Category" : "Add Category"}</DialogTitle>
                    <DialogDescription/>
                </DialogHeader>
                <CategoryForm onClose={() => onClose(true)} selectedCategory={selectedCategory}/>
            </DialogContent>
        </Dialog>
    )
}