import { Chapter } from "@/app/Models/chapter-schmea";
import { UserProgress } from "@/app/Models/userprogress-schema";
import dbConnect from "@/lib/dbConnect";

export const getProgress= async(
    userId:string,
    courseId:string,
): Promise<number>=>{
    try {
        await dbConnect();
        const publishedChapters= await Chapter.find({courseId:courseId, isPublished:true}).select('_id')
        const publishedChapterIds=publishedChapters.map((chapter)=> chapter.id)
        const validCompletedChapters= await UserProgress.countDocuments({
            userId:userId,
            courseId:{$in:publishedChapterIds},
            isCompleted:true,
        });

        const progressPercentage= (validCompletedChapters / publishedChapterIds.length)*100;
        return progressPercentage;

    } catch (error) {
        console.log(error);
        return 0;
    }
}