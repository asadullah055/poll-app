import BookmarkPollContent from "@/components/bookmarked-poll/BookmarkPollContent";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { getUser } from "@/lib/dal";
import { getBookmarkedPolls } from "@/query";

const BookmarkedPolls = async () => {
  const user = await getUser();
  const { polls } = await getBookmarkedPolls(user?.user?.id);
  return (
    <DashboardLayout user={user}>
      <BookmarkPollContent polls={polls} user={user} />
    </DashboardLayout>
  );
};

export default BookmarkedPolls;
