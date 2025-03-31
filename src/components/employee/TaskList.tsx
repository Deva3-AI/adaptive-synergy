import React, { useState, useEffect } from 'react';
import { taskService } from '@/services/api';
import { useAuth } from '@/hooks/use-auth';
import { Task } from '@/interfaces/tasks';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  CheckCircle,
  Clock,
  FileText,
  Filter,
  ListChecks,
  Loader2,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Search,
  Share2,
  Tag,
  Trash2,
  UserRoundCheck,
  Users,
} from "lucide-react";
import { format, subDays, addDays } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { DateRange } from "react-day-picker"
import { CalendarIcon } from "@radix-ui/react-icons"
import { DateRangePicker } from "@/components/date-range-picker"
import { Progress } from "@/components/ui/progress"
import { toast } from 'sonner';

interface ExtendedTask extends Task {
  comments?: any[];
}

interface TaskComment {
  id: number;
  task_id: number;
  user_id: number;
  comment: string;
  created_at: string;
}

interface TaskFilter {
  status?: string;
  priority?: string;
  client?: string;
  assignee?: string;
  dateRange?: DateRange | undefined;
}

const TaskList = () => {
  const [tasks, setTasks] = useState<ExtendedTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<ExtendedTask | null>(null);
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
  const [isDeleteTaskOpen, setIsDeleteTaskOpen] = useState(false);
  const [isShareTaskOpen, setIsShareTaskOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isBulkEditOpen, setIsBulkEditOpen] = useState(false);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [isBulkShareOpen, setIsBulkShareOpen] = useState(false);
  const [isBulkAssignOpen, setIsBulkAssignOpen] = useState(false);
  const [isBulkStatusOpen, setIsBulkStatusOpen] = useState(false);
  const [isBulkPriorityOpen, setIsBulkPriorityOpen] = useState(false);
  const [isBulkDueDateOpen, setIsBulkDueDateOpen] = useState(false);
  const [isBulkClientOpen, setIsBulkClientOpen] = useState(false);
  const [isBulkCategoryOpen, setIsBulkCategoryOpen] = useState(false);
  const [isBulkTagOpen, setIsBulkTagOpen] = useState(false);
  const [isBulkCommentOpen, setIsBulkCommentOpen] = useState(false);
  const [isBulkAttachmentOpen, setIsBulkAttachmentOpen] = useState(false);
  const [isBulkDependencyOpen, setIsBulkDependencyOpen] = useState(false);
  const [isBulkSubtaskOpen, setIsBulkSubtaskOpen] = useState(false);
  const [isBulkChecklistOpen, setIsBulkChecklistOpen] = useState(false);
  const [isBulkTimeTrackingOpen, setIsBulkTimeTrackingOpen] = useState(false);
  const [isBulkRecurringOpen, setIsBulkRecurringOpen] = useState(false);
  const [isBulkReminderOpen, setIsBulkReminderOpen] = useState(false);
  const [isBulkApprovalOpen, setIsBulkApprovalOpen] = useState(false);
  const [isBulkAutomationOpen, setIsBulkAutomationOpen] = useState(false);
  const [isBulkIntegrationOpen, setIsBulkIntegrationOpen] = useState(false);
  const [isBulkExportOpen, setIsBulkExportOpen] = useState(false);
  const [isBulkPrintOpen, setIsBulkPrintOpen] = useState(false);
  const [isBulkDuplicateOpen, setIsBulkDuplicateOpen] = useState(false);
  const [isBulkMoveOpen, setIsBulkMoveOpen] = useState(false);
  const [isBulkArchiveOpen, setIsBulkArchiveOpen] = useState(false);
  const [isBulkUnarchiveOpen, setIsBulkUnarchiveOpen] = useState(false);
  const [isBulkWatchOpen, setIsBulkWatchOpen] = useState(false);
  const [isBulkUnwatchOpen, setIsBulkUnwatchOpen] = useState(false);
  const [isBulkFollowOpen, setIsBulkFollowOpen] = useState(false);
  const [isBulkUnfollowOpen, setIsBulkUnfollowOpen] = useState(false);
  const [isBulkLikeOpen, setIsBulkLikeOpen] = useState(false);
  const [isBulkUnlikeOpen, setIsBulkUnlikeOpen] = useState(false);
  const [isBulkVoteOpen, setIsBulkVoteOpen] = useState(false);
  const [isBulkUnvoteOpen, setIsBulkUnvoteOpen] = useState(false);
  const [isBulkPinOpen, setIsBulkPinOpen] = useState(false);
  const [isBulkUnpinOpen, setIsBulkUnpinOpen] = useState(false);
  const [isBulkSnoozeOpen, setIsBulkSnoozeOpen] = useState(false);
  const [isBulkUnsnoozeOpen, setIsBulkUnsnoozeOpen] = useState(false);
  const [isBulkMuteOpen, setIsBulkMuteOpen] = useState(false);
  const [isBulkUnmuteOpen] = useState(false);
  const [isBulkFlagOpen, setIsBulkFlagOpen] = useState(false);
  const [isBulkUnflagOpen, setIsBulkUnflagOpen] = useState(false);
  const [isBulkTagAsOpen, setIsBulkTagAsOpen] = useState(false);
  const [isBulkUntagAsOpen, setIsBulkUntagAsOpen] = useState(false);
  const [isBulkMarkAsOpen, setIsBulkMarkAsOpen] = useState(false);
  const [isBulkUnmarkAsOpen, setIsBulkUnmarkAsOpen] = useState(false);
  const [isBulkVerifyOpen, setIsBulkVerifyOpen] = useState(false);
  const [isBulkUnverifyOpen, setIsBulkUnverifyOpen] = useState(false);
  const [isBulkApproveOpen, setIsBulkApproveOpen] = useState(false);
  const [isBulkUnapproveOpen, setIsBulkUnapproveOpen] = useState(false);
  const [isBulkRejectOpen, setIsBulkRejectOpen] = useState(false);
  const [isBulkUnrejectOpen, setIsBulkUnrejectOpen] = useState(false);
  const [isBulkCompleteOpen, setIsBulkCompleteOpen] = useState(false);
  const [isBulkIncompleteOpen, setIsBulkIncompleteOpen] = useState(false);
  const [isBulkArchiveTasksOpen, setIsBulkArchiveTasksOpen] = useState(false);
  const [isBulkUnarchiveTasksOpen, setIsBulkUnarchiveTasksOpen] = useState(false);
  const [isBulkDeleteTasksOpen, setIsBulkDeleteTasksOpen] = useState(false);
  const [isBulkRestoreTasksOpen, setIsBulkRestoreTasksOpen] = useState(false);
  const [isBulkPermanentDeleteTasksOpen, setIsBulkPermanentDeleteTasksOpen] = useState(false);
  const [isBulkExportTasksOpen, setIsBulkExportTasksOpen] = useState(false);
  const [isBulkPrintTasksOpen, setIsBulkPrintTasksOpen] = useState(false);
  const [isBulkDuplicateTasksOpen, setIsBulkDuplicateTasksOpen] = useState(false);
  const [isBulkMoveTasksOpen, setIsBulkMoveTasksOpen] = useState(false);
  const [isBulkCopyTasksOpen, setIsBulkCopyTasksOpen] = useState(false);
  const [isBulkLinkTasksOpen, setIsBulkLinkTasksOpen] = useState(false);
  const [isBulkUnlinkTasksOpen, setIsBulkUnlinkTasksOpen] = useState(false);
  const [isBulkMergeTasksOpen, setIsBulkMergeTasksOpen] = useState(false);
  const [isBulkSplitTasksOpen, setIsBulkSplitTasksOpen] = useState(false);
  const [isBulkConvertTasksOpen, setIsBulkConvertTasksOpen] = useState(false);
  const [isBulkAddSubtasksOpen, setIsBulkAddSubtasksOpen] = useState(false);
  const [isBulkRemoveSubtasksOpen, setIsBulkRemoveSubtasksOpen] = useState(false);
  const [isBulkAddChecklistsOpen, setIsBulkAddChecklistsOpen] = useState(false);
  const [isBulkRemoveChecklistsOpen, setIsBulkRemoveChecklistsOpen] = useState(false);
  const [isBulkAddAttachmentsOpen, setIsBulkAddAttachmentsOpen] = useState(false);
  const [isBulkRemoveAttachmentsOpen, setIsBulkRemoveAttachmentsOpen] = useState(false);
  const [isBulkAddCommentsOpen, setIsBulkAddCommentsOpen] = useState(false);
  const [isBulkRemoveCommentsOpen, setIsBulkRemoveCommentsOpen] = useState(false);
  const [isBulkAddDependenciesOpen, setIsBulkAddDependenciesOpen] = useState(false);
  const [isBulkRemoveDependenciesOpen, setIsBulkRemoveDependenciesOpen] = useState(false);
  const [isBulkAddRemindersOpen, setIsBulkAddRemindersOpen] = useState(false);
  const [isBulkRemoveRemindersOpen, setIsBulkRemoveRemindersOpen] = useState(false);
  const [isBulkAddApprovalsOpen, setIsBulkAddApprovalsOpen] = useState(false);
  const [isBulkRemoveApprovalsOpen, setIsBulkRemoveApprovalsOpen] = useState(false);
  const [isBulkAddAutomationsOpen, setIsBulkAddAutomationsOpen] = useState(false);
  const [isBulkRemoveAutomationsOpen, setIsBulkRemoveAutomationsOpen] = useState(false);
  const [isBulkAddIntegrationsOpen, setIsBulkAddIntegrationsOpen] = useState(false);
  const [isBulkRemoveIntegrationsOpen, setIsBulkRemoveIntegrationsOpen] = useState(false);
  const [isBulkAddTagsOpen, setIsBulkAddTagsOpen] = useState(false);
  const [isBulkRemoveTagsOpen, setIsBulkRemoveTagsOpen] = useState(false);
  const [isBulkAddCategoriesOpen, setIsBulkAddCategoriesOpen] = useState(false);
  const [isBulkRemoveCategoriesOpen, setIsBulkRemoveCategoriesOpen] = useState(false);
  const [isBulkAddTimeTrackingOpen, setIsBulkAddTimeTrackingOpen] = useState(false);
  const [isBulkRemoveTimeTrackingOpen, setIsBulkRemoveTimeTrackingOpen] = useState(false);
  const [isBulkAddRecurringOpen, setIsBulkAddRecurringOpen] = useState(false);
  const [isBulkRemoveRecurringOpen, setIsBulkRemoveRecurringOpen] = useState(false);
  const [isBulkAddWatchersOpen, setIsBulkAddWatchersOpen] = useState(false);
  const [isBulkRemoveWatchersOpen, setIsBulkRemoveWatchersOpen] = useState(false);
  const [isBulkAddFollowersOpen, setIsBulkAddFollowersOpen] = useState(false);
  const [isBulkRemoveFollowersOpen, setIsBulkRemoveFollowersOpen] = useState(false);
  const [isBulkAddLikesOpen, setIsBulkAddLikesOpen] = useState(false);
  const [isBulkRemoveLikesOpen, setIsBulkRemoveLikesOpen] = useState(false);
  const [isBulkAddVotesOpen, setIsBulkAddVotesOpen] = useState(false);
  const [isBulkRemoveVotesOpen, setIsBulkRemoveVotesOpen] = useState(false);
  const [isBulkAddPinsOpen, setIsBulkAddPinsOpen] = useState(false);
  const [isBulkRemovePinsOpen, setIsBulkRemovePinsOpen] = useState(false);
  const [isBulkAddSnoozesOpen, setIsBulkAddSnoozesOpen] = useState(false);
  const [isBulkRemoveSnoozesOpen, setIsBulkRemoveSnoozesOpen] = useState(false);
  const [isBulkAddMutesOpen, setIsBulkAddMutesOpen] = useState(false);
  const [isBulkRemoveMutesOpen, setIsBulkRemoveMutesOpen] = useState(false);
  const [isBulkAddFlagsOpen, setIsBulkAddFlagsOpen] = useState(false);
  const [isBulkRemoveFlagsOpen, setIsBulkRemoveFlagsOpen] = useState(false);
  const [isBulkAddMarksOpen, setIsBulkAddMarksOpen] = useState(false);
  const [isBulkRemoveMarksOpen, setIsBulkRemoveMarksOpen] = useState(false);
  const [isBulkAddVerificationsOpen, setIsBulkAddVerificationsOpen] = useState(false);
  const [isBulkRemoveVerificationsOpen, setIsBulkRemoveVerificationsOpen] = useState(false);
  const [isBulkAddApprovalsTasksOpen, setIsBulkAddApprovalsTasksOpen] = useState(false);
  const [isBulkRemoveApprovalsTasksOpen, setIsBulkRemoveApprovalsTasksOpen] = useState(false);
  const [isBulkAddRejectionsTasksOpen, setIsBulkAddRejectionsTasksOpen] = useState(false);
  const [isBulkRemoveRejectionsTasksOpen, setIsBulkRemoveRejectionsTasksOpen] = useState(false);
  const [isBulkAddCompletionsTasksOpen, setIsBulkAddCompletionsTasksOpen] = useState(false);
  const [isBulkRemoveCompletionsTasksOpen, setIsBulkRemoveCompletionsTasksOpen] = useState(false);
  const [isBulkAddIncompletionsTasksOpen, setIsBulkAddIncompletionsTasksOpen] = useState(false);
  const [isBulkRemoveIncompletionsTasksOpen, setIsBulkRemoveIncompletionsTasksOpen] = useState(false);
  const [isBulkArchiveTasksTasksOpen, setIsBulkArchiveTasksTasksOpen] = useState(false);
  const [isBulkUnarchiveTasksTasksOpen, setIsBulkUnarchiveTasksTasksOpen] = useState(false);
  const [isBulkDeleteTasksTasksOpen, setIsBulkDeleteTasksTasksOpen] = useState(false);
  const [isBulkRestoreTasksTasksOpen, setIsBulkRestoreTasksTasksOpen] = useState(false);
  const [isBulkPermanentDeleteTasksTasksOpen, setIsBulkPermanentDeleteTasksTasksOpen] = useState(false);
  const [isBulkExportTasksTasksOpen, setIsBulkExportTasksTasksOpen] = useState(false);
  const [isBulkPrintTasksTasksOpen, setIsBulkPrintTasksTasksOpen] = useState(false);
  const [isBulkDuplicateTasksTasksOpen, setIsBulkDuplicateTasksTasksOpen] = useState(false);
  const [isBulkMoveTasksTasksOpen, setIsBulkMoveTasksTasksOpen] = useState(false);
  const [isBulkCopyTasksTasksOpen, setIsBulkCopyTasksTasksOpen] = useState(false);
  const [isBulkLinkTasksTasksOpen, setIsBulkLinkTasksTasksOpen] = useState(false);
  const [isBulkUnlinkTasksTasksOpen, setIsBulkUnlinkTasksTasksOpen] = useState(false);
  const [isBulkMergeTasksTasksOpen, setIsBulkMergeTasksTasksOpen] = useState(false);
  const [isBulkSplitTasksTasksOpen, setIsBulkSplitTasksTasksOpen] = useState(false);
  const [isBulkConvertTasksTasksOpen, setIsBulkConvertTasksTasksOpen] = useState(false);
  const [isBulkAddSubtasksTasksOpen, setIsBulkAddSubtasksTasksOpen] = useState(false);
  const [isBulkRemoveSubtasksTasksOpen, setIsBulkRemoveSubtasksTasksOpen] = useState(false);
  const [isBulkAddChecklistsTasksOpen, setIsBulkAddChecklistsTasksOpen] = useState(false);
  const [isBulkRemoveChecklistsTasksOpen, setIsBulkRemoveChecklistsTasksOpen] = useState(false);
  const [isBulkAddAttachmentsTasksOpen, setIsBulkAddAttachmentsTasksOpen] = useState(false);
  const [isBulkRemoveAttachmentsTasksOpen, setIsBulkRemoveAttachmentsTasksOpen] = useState(false);
  const [isBulkAddCommentsTasksOpen, setIsBulkAddCommentsTasksOpen] = useState(false);
  const [isBulkRemoveCommentsTasksOpen, setIsBulkRemoveCommentsTasksOpen] = useState(false);
  const [isBulkAddDependenciesTasksOpen, setIsBulkAddDependenciesTasksOpen] = useState(false);
  const [isBulkRemoveDependenciesTasksOpen, setIsBulkRemoveDependenciesTasksOpen] = useState(false);
  const [isBulkAddRemindersTasksOpen, setIsBulkAddRemindersTasksOpen] = useState(false);
  const [isBulkRemoveRemindersTasksOpen, setIsBulkRemoveRemindersTasksOpen] = useState(false);
  const [isBulkAddApprovalsTasksTasksOpen, setIsBulkAddApprovalsTasksTasksOpen] = useState(false);
  const [isBulkRemoveApprovalsTasksTasksOpen, setIsBulkRemoveApprovalsTasksTasksOpen] = useState(false);
  const [isBulkAddAutomationsTasksTasksOpen, setIsBulkAddAutomationsTasksTasksOpen] = useState(false);
  const [isBulkRemoveAutomationsTasksTasksOpen, setIsBulkRemoveAutomationsTasksTasksOpen] = useState(false);
  const [isBulkAddIntegrationsTasksTasksOpen, setIsBulkAddIntegrationsTasksTasksOpen] = useState(false);
  const [isBulkRemoveIntegrationsTasksTasksOpen, setIsBulkRemoveIntegrationsTasksTasksOpen] = useState(false);
  const [isBulkAddTagsTasksOpen, setIsBulkAddTagsTasksOpen] = useState(false);
  const [isBulkRemoveTagsTasksOpen, setIsBulkRemoveTagsTasksOpen] = useState(false);
  const [isBulkAddCategoriesTasksOpen, setIsBulkAddCategoriesTasksOpen] = useState(false);
  const [isBulkRemoveCategoriesTasksOpen, setIsBulkRemoveCategoriesTasksOpen] = useState(false);
  const [isBulkAddTimeTrackingTasksOpen, setIsBulkAddTimeTrackingTasksOpen] = useState(false);
  const [isBulkRemoveTimeTrackingTasksOpen, setIsBulkRemoveTimeTrackingTasksOpen] = useState(false);
  const [isBulkAddRecurringTasksOpen, setIsBulkAddRecurringTasksOpen] = useState(false);
  const [isBulkRemoveRecurringTasksOpen, setIsBulkRemoveRecurringTasksOpen] = useState(false);
  const [isBulkAddWatchersTasksOpen, setIsBulkAddWatchersTasksOpen] = useState(false);
  const [isBulkRemoveWatchersTasksOpen, setIsBulkRemoveWatchersTasksOpen] = useState(false);
  const [isBulkAddFollowersTasksOpen, setIsBulkAddFollowersTasksOpen] = useState(false);
  const [isBulkRemoveFollowersTasksOpen, setIsBulkRemoveFollowersTasksOpen] = useState(false);
  const [isBulkAddLikesTasksOpen, setIsBulkAddLikesTasksOpen] = useState(false);
  const [isBulkRemoveLikesTasksOpen, setIsBulkRemoveLikesTasksOpen] = useState(false);
  const [isBulkAddVotesTasksOpen, setIsBulkAddVotesTasksOpen] = useState(false);
  const [isBulkRemoveVotesTasksOpen, setIsBulkRemoveVotesTasksOpen] = useState(false);
  const [isBulkAddPinsTasksOpen, setIsBulkAddPinsTasksOpen] = useState(false);
  const [isBulkRemovePinsTasksOpen, setIsBulkRemovePinsTasksOpen] = useState(false);
  const [isBulkAddSnoozesTasksOpen, setIsBulkAddSnoozesTasksOpen] = useState(false);
  const [isBulkRemoveSnoozesTasksOpen, setIsBulkRemoveSnoozesTasksOpen] = useState(false);
  const [isBulkAddMutesTasksOpen, setIsBulkAddMutesTasksOpen] = useState(false);
  const [isBulkRemoveMutesTasksOpen, setIsBulkRemoveMutesTasksOpen] = useState(false);
  const [isBulkAddFlagsTasksOpen, setIsBulkAddFlagsTasksOpen] = useState(false);
  const [isBulkRemoveFlagsTasksOpen, setIsBulkRemoveFlagsTasksOpen] = useState(false);
  const [isBulkAddMarksTasksTasksOpen, setIsBulkAddMarksTasksTasksOpen] = useState(false);
  const [isBulkRemoveMarksTasksTasksOpen, setIsBulkRemoveMarksTasksTasksOpen] = useState(false);
  const [isBulkAddVerificationsTasksTasksOpen, setIsBulkAddVerificationsTasksTasksOpen] = useState(false);
  const [isBulkRemoveVerificationsTasksTasksOpen, setIsBulkRemoveVerificationsTasksTasksOpen] = useState(false);
  const [filter, setFilter] = useState<TaskFilter>({});
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setError(null);
      try {
        const tasksData = await taskService.getTasks();
        setTasks(tasksData);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter(task => {
    const statusFilter = !filter.status || task.status === filter.status;
    const priorityFilter = !filter.priority || task.priority === filter.priority;
    const clientFilter = !filter.client || task.client === filter.client;
    const assigneeFilter = !filter.assignee || task.assigned_to === Number(filter.assignee);
    const dateRangeFilter = !filter.dateRange || (task.due_date &&
      new Date(task.due_date) >= (filter.dateRange.from || new Date(0)) &&
      new Date(task.due_date) <= (filter.dateRange.to || new Date()));
    const searchFilter = !searchTerm ||
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());

    return statusFilter && priorityFilter && clientFilter && assigneeFilter && dateRangeFilter && searchFilter;
  });

  const handleFilterChange = (newFilter: TaskFilter) => {
    setFilter(newFilter);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleOpenTaskDetail = (task: ExtendedTask) => {
    setSelectedTask(task);
    setIsTaskDetailOpen(true);
  };

  const handleCloseTaskDetail = () => {
    setIsTaskDetailOpen(false);
  };

  const handleOpenCreateTask = () => {
    setIsCreateTaskOpen(true);
  };

  const handleCloseCreateTask = () => {
    setIsCreateTaskOpen(false);
  };

  const handleOpenEditTask = (task: ExtendedTask) => {
    setSelectedTask(task);
    setIsEditTaskOpen(true);
  };

  const handleCloseEditTask = () => {
    setIsEditTaskOpen(false);
  };

  const handleOpenDeleteTask = (task: ExtendedTask) => {
    setSelectedTask(task);
    setIsDeleteTaskOpen(true);
  };

  const handleCloseDeleteTask = () => {
    setIsDeleteTaskOpen(false);
  };

  const handleOpenShareTask = (task: ExtendedTask) => {
    setSelectedTask(task);
    setIsShareTaskOpen(true);
  };

  const handleCloseShareTask = () => {
    setIsShareTaskOpen(false);
  };

  const handleOpenFilter = () => {
    setIsFilterOpen(true);
  };

  const handleCloseFilter = () => {
    setIsFilterOpen(false);
  };

  const handleOpenBulkEdit = () => {
    setIsBulkEditOpen(true);
  };

  const handleCloseBulkEdit = () => {
    setIsBulkEditOpen(false);
  };

  const handleOpenBulkDelete = () => {
    setIsBulkDeleteOpen(true);
  };

  const handleCloseBulkDelete = () => {
    setIsBulkDeleteOpen(false);
  };

  const handleOpenBulkShare = () => {
    setIsBulkShareOpen(true);
  };

  const handleCloseBulkShare = () => {
    setIsBulkShareOpen(false);
  };

  const handleOpenBulkAssign = () => {
    setIsBulkAssignOpen(true);
  };

  const handleCloseBulkAssign = () => {
    setIsBulkAssignOpen(false);
  };

  const handleOpenBulkStatus = () => {
    setIsBulkStatusOpen(true);
  };

  const handleCloseBulkStatus = () => {
    setIsBulkStatusOpen(false);
  };

  const handleOpenBulkPriority = () => {
    setIsBulkPriorityOpen(true);
  };

  const handleCloseBulkPriority = () => {
    setIsBulkPriorityOpen(false);
  };

  const handleOpenBulkDueDate = () => {
    setIsBulkDueDateOpen(true);
  };

  const handleCloseBulkDueDate = () => {
    setIsBulkDueDateOpen(false);
  };

  const handleOpenBulkClient = () => {
    setIsBulkClientOpen(true);
  };

  const handleCloseBulkClient = () => {
    setIsBulkClientOpen(false);
  };

  const handleOpenBulkCategory = () => {
    setIsBulkCategoryOpen(true);
  };

  const handleCloseBulkCategory = () => {
    setIsBulkCategoryOpen(false);
  };

  const handleOpenBulkTag = () => {
    setIsBulkTagOpen(true);
  };

  const handleCloseBulkTag = () => {
    setIsBulkTagOpen(false);
  };

  const handleOpenBulkComment = () => {
    setIsBulkCommentOpen(true);
  };

  const handleCloseBulkComment = () => {
    setIsBulkCommentOpen(false);
  };

  const handleOpenBulkAttachment = () => {
    setIsBulkAttachmentOpen(true);
  };

  const handleCloseBulkAttachment = () => {
    setIsBulkAttachmentOpen(false);
  };

  const handleOpenBulkDependency = () => {
    setIsBulkDependencyOpen(true);
  };

  const handleCloseBulkDependency = () => {
    setIsBulkDependencyOpen(false);
  };

  const handleOpenBulkSubtask = () => {
    setIsBulkSubtaskOpen(true);
  };

  const handleCloseBulkSubtask = () => {
    setIsBulkSubtaskOpen(false);
  };

  const handleOpenBulkChecklist = () => {
    setIsBulkChecklistOpen(true);
  };

  const handleCloseBulkChecklist = () => {
    setIsBulkChecklistOpen(false);
  };

  const handleOpenBulkTimeTracking = () => {
    setIsBulkTimeTrackingOpen(true);
  };

  const handleCloseBulkTimeTracking = () => {
    setIsBulkTimeTrackingOpen(false);
  };

  const handleOpenBulkRecurring = () => {
    setIsBulkRecurringOpen(true);
  };

  const handleCloseBulkRecurring = () => {
    setIsBulkRecurringOpen(false);
  };

  const handleOpenBulkReminder = () => {
    setIsBulkReminderOpen(true);
  };

  const handleCloseBulkReminder = () => {
    setIsBulkReminderOpen(false);
  };

  const handleOpenBulkApproval = () => {
    setIsBulkApprovalOpen(true);
  };

  const handleCloseBulkApproval = () => {
    setIsBulkApprovalOpen(false);
  };

  const handleOpenBulkAutomation = () => {
    setIsBulkAutomationOpen(true);
  };

  const handleCloseBulkAutomation = () => {
    setIsBulkAutomationOpen(false);
  };

  const handleOpenBulkIntegration = () => {
    setIsBulkIntegrationOpen(true);
  };

  const handleCloseBulkIntegration = () => {
    setIsBulkIntegrationOpen(false);
  };

  const handleOpenBulkExport = () => {
    setIsBulkExportOpen(true);
  };

  const handleCloseBulkExport = () => {
    setIsBulkExportOpen(false);
  };

  const handleOpenBulkPrint = () => {
    setIsBulkPrintOpen(true);
  };

  const handleCloseBulkPrint = () => {
    setIsBulkPrintOpen(false);
  };

  const handleOpenBulkDuplicate = () => {
    setIsBulkDuplicateOpen(true);
  };

  const handleCloseBulkDuplicate = () => {
    setIsBulkDuplicateOpen(false);
  };

  const handleOpenBulkMove = () => {
    setIsBulkMoveOpen(true);
  };

  const handleCloseBulkMove = () => {
    setIsBulkMoveOpen(false);
  };

  const handleOpenBulkArchive = () => {
    setIsBulkArchiveOpen(true);
  };

  const handleCloseBulkArchive = () => {
    setIsBulkArchiveOpen(false);
  };

  const handleOpenBulkUnarchive = () => {
    setIsBulkUnarchiveOpen(true);
  };

  const handleCloseBulkUnarchive = () => {
    setIsBulkUnarchiveOpen(false);
  };

  const handleOpenBulkWatch = () => {
    setIsBulkWatchOpen(true);
  };

  const handleCloseBulkWatch = () => {
    setIsBulkWatchOpen(false);
  };

  const handleOpenBulkUnwatch = () => {
    setIsBulkUnwatchOpen(true);
  };

  const handleCloseBulkUnwatch = () => {
    setIsBulkUnwatchOpen(false);
  };

  const handleOpenBulkFollow = () => {
    setIsBulkFollowOpen(true);
  };

  const handleCloseBulkFollow = () => {
    setIsBulkFollowOpen(false);
  };

  const handleOpenBulkUnfollow = () => {
    setIsBulkUnfollowOpen(true);
  };

  const handleCloseBulkUnfollow = () => {
    setIsBulkUnfollowOpen(false);
  };

  const handleOpenBulkLike = () => {
    setIsBulkLikeOpen(true);
  };

  const handleCloseBulkLike = () => {
    setIsBulkLikeOpen(false);
  };

  const handleOpenBulkUnlike = () => {
    setIsBulkUnlikeOpen(true);
  };

  const handleCloseBulkUnlike = () => {
    setIsBulkUnlikeOpen(false);
  };

  const handleOpenBulkVote = () => {
    setIsBulkVoteOpen(true);
  };

  const handleCloseBulkVote = () => {
    setIsBulkVoteOpen(false);
  };

  const handleOpenBulkUnvote = () => {
    setIsBulkUnvoteOpen(true);
  };

  const handleCloseBulkUnvote = () => {
    setIsBulkUnvoteOpen(false);
  };

  const handleOpenBulkPin = () => {
    setIsBulkPinOpen(true);
  };

  const handleCloseBulkPin = () => {
    setIsBulkPinOpen(false);
  };

  const handleOpenBulkUnpin = () => {
    setIsBulkUnpinOpen(true);
  };

  const handleCloseBulkUnpin = () => {
    setIsBulkUnpinOpen(false);
  };

  const handleOpenBulkSnooze = () => {
    setIsBulkSnoozeOpen(true);
  };

  const handleCloseBulkSnooze = () => {
    setIsBulkSnoozeOpen(false);
  };

  const handleOpenBulkUnsnooze = () => {
    setIsBulkUnsnoozeOpen(true);
  };

  const handleCloseBulkUnsnooze = () => {
    setIsBulkUnsnoozeOpen(false);
  };

  const handleOpenBulkMute = () => {
    setIsBulkMuteOpen(true);
  };

  const handleCloseBulkMute = () => {
    setIsBulkMuteOpen(false);
  };

  const handleOpenBulkUnmute = () => {
    setIsBulkUnmuteOpen(true);
  };

  const handleCloseBulkUnmute = () => {
    setIsBulkUnmuteOpen(false);
  };

  const handleOpenBulkFlag = () => {
    setIsBulkFlagOpen(true);
  };

  const handleCloseBulkFlag = () => {
    setIsBulkFlagOpen(false);
  };

  const handleOpenBulkUnflag = () => {
    setIsBulkUnflagOpen(true);
  };

  const handleCloseBulkUnflag = () => {
    setIsBulkUnflagOpen(false);
  };

  const handleOpenBulkTagAs = () => {
    setIsBulkTagAsOpen(true);
  };

  const handleCloseBulkTagAs = () => {
    setIsBulkTagAsOpen(false);
  };

  const handleOpenBulkUntagAs = () => {
    setIsBulkUntagAsOpen(true);
  };

  const handleCloseBulkUntagAs = () => {
    setIsBulkUntagAsOpen(false);
  };

  const handleOpenBulkMarkAs = () => {
    setIsBulkMarkAsOpen(true);
  };

  const handleCloseBulkMarkAs = () => {
    setIsBulkMarkAsOpen(false);
  };

  const handleOpenBulkUnmarkAs = () => {
    setIsBulkUnmarkAsOpen(true);
  };

  const handleCloseBulkUnmarkAs = () => {
    setIsBulkUnmarkAsOpen(false);
  };

  const handleOpenBulkVerify = () => {
    setIsBulkVerifyOpen(true);
  };

  const handleCloseBulkVerify = () => {
    setIsBulkVerifyOpen(false);
  };

  const handleOpenBulkUnverify = () => {
    setIsBulkUnverifyOpen(true);
  };

  const handleCloseBulkUnverify = () => {
    setIsBulkUnverifyOpen(false);
  };

  const handleOpenBulkApprove = () => {
    setIsBulkApproveOpen(true);
  };

  const handleCloseBulkApprove = () => {
    setIsBulkApproveOpen(false);
  };

  const handleOpenBulkUnapprove = () => {
    setIsBulkUnapproveOpen(true);
  };
