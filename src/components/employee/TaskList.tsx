
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
  const [isBulkUnmuteOpen, setIsBulkUnmuteOpen] = useState(false);
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

  const handleCloseBulkUnapprove = () => {
    setIsBulkUnapproveOpen(false);
  };

  const handleOpenBulkReject = () => {
    setIsBulkRejectOpen(true);
  };

  const handleCloseBulkReject = () => {
    setIsBulkRejectOpen(false);
  };

  const handleOpenBulkUnreject = () => {
    setIsBulkUnrejectOpen(true);
  };

  const handleCloseBulkUnreject = () => {
    setIsBulkUnrejectOpen(false);
  };

  const handleOpenBulkComplete = () => {
    setIsBulkCompleteOpen(true);
  };

  const handleCloseBulkComplete = () => {
    setIsBulkCompleteOpen(false);
  };

  const handleOpenBulkIncomplete = () => {
    setIsBulkIncompleteOpen(true);
  };

  const handleCloseBulkIncomplete = () => {
    setIsBulkIncompleteOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Tasks</h2>
        <Button onClick={handleOpenCreateTask} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Task
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex-1 relative w-full md:max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search tasks..." 
            className="pl-10" 
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={handleOpenFilter} className="flex items-center gap-1">
            <Filter className="h-4 w-4 mr-1" />
            Filters
          </Button>
          <DateRangePicker date={filter.dateRange} setDate={(dateRange) => setFilter({ ...filter, dateRange })} align="end" />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-800 p-4 rounded-md border border-red-200">
          {error}
        </div>
      )}

      <Card>
        <CardHeader className="px-6 py-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">All Tasks</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleOpenBulkEdit} className="flex items-center gap-1">
                <FileText className="h-4 w-4 mr-1" />
                Bulk Edit
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
              <ListChecks className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">No tasks found</p>
              <p className="text-sm text-muted-foreground mb-4">Try adjusting your filters or create a new task</p>
              <Button onClick={handleOpenCreateTask} size="sm" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Task
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox />
                  </TableHead>
                  <TableHead>Task</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Assignee</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.map((task) => (
                  <TableRow key={task.id || task.task_id}>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>
                      <div 
                        className="font-medium hover:underline cursor-pointer"
                        onClick={() => handleOpenTaskDetail(task)}
                      >
                        {task.title}
                      </div>
                      <div className="truncate text-xs text-muted-foreground max-w-[300px]">
                        {task.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      {task.client_name || task.client || "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>
                            {task.assignee_name ? task.assignee_name.charAt(0) : "?"}
                          </AvatarFallback>
                        </Avatar>
                        <span>{task.assignee_name || "Unassigned"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        task.status === "completed" ? "success" :
                        task.status === "in_progress" ? "default" :
                        task.status === "pending" ? "secondary" :
                        task.status === "cancelled" ? "destructive" :
                        "outline"
                      }>
                        {task.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        task.priority === "high" ? "destructive" :
                        task.priority === "medium" ? "warning" :
                        "secondary"
                      }>
                        {task.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {task.due_date ? format(new Date(task.due_date), 'MMM dd, yyyy') : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleOpenTaskDetail(task)}>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleOpenEditTask(task)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleOpenShareTask(task)}>
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleOpenDeleteTask(task)}
                            className="text-destructive"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Task Details Dialog */}
      {selectedTask && (
        <Dialog open={isTaskDetailOpen} onOpenChange={setIsTaskDetailOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedTask.title}</DialogTitle>
              <DialogDescription>
                {selectedTask.description}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Status</Label>
                  <Badge className="mt-1" variant={
                    selectedTask.status === "completed" ? "success" :
                    selectedTask.status === "in_progress" ? "default" :
                    selectedTask.status === "pending" ? "secondary" :
                    selectedTask.status === "cancelled" ? "destructive" :
                    "outline"
                  }>
                    {selectedTask.status}
                  </Badge>
                </div>
                <div>
                  <Label>Priority</Label>
                  <Badge className="mt-1" variant={
                    selectedTask.priority === "high" ? "destructive" :
                    selectedTask.priority === "medium" ? "warning" :
                    "secondary"
                  }>
                    {selectedTask.priority}
                  </Badge>
                </div>
                <div>
                  <Label>Client</Label>
                  <p className="text-sm mt-1">{selectedTask.client_name || selectedTask.client || "-"}</p>
                </div>
                <div>
                  <Label>Assignee</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>
                        {selectedTask.assignee_name ? selectedTask.assignee_name.charAt(0) : "?"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{selectedTask.assignee_name || "Unassigned"}</span>
                  </div>
                </div>
                <div>
                  <Label>Due Date</Label>
                  <p className="text-sm mt-1">
                    {selectedTask.due_date ? format(new Date(selectedTask.due_date), 'MMMM dd, yyyy') : "-"}
                  </p>
                </div>
                <div>
                  <Label>Created At</Label>
                  <p className="text-sm mt-1">
                    {selectedTask.created_at ? format(new Date(selectedTask.created_at), 'MMMM dd, yyyy') : "-"}
                  </p>
                </div>
              </div>

              {/* Comments Section */}
              <div className="mt-6">
                <Label className="text-base font-medium">Comments ({selectedTask.comments?.length || 0})</Label>
                <ScrollArea className="h-[200px] mt-2">
                  {selectedTask.comments && selectedTask.comments.length > 0 ? (
                    <div className="space-y-4">
                      {selectedTask.comments.map((comment: TaskComment, index: number) => (
                        <div key={index} className="flex gap-4 text-sm">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>U</AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">User</span>
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(comment.created_at), 'MMM dd, yyyy HH:mm')}
                              </span>
                            </div>
                            <p>{comment.comment}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No comments yet</p>
                  )}
                </ScrollArea>
                <div className="mt-2">
                  <Textarea placeholder="Add a comment..." className="min-h-[80px]" />
                  <div className="mt-2 flex justify-end">
                    <Button>Post Comment</Button>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCloseTaskDetail}>Close</Button>
              <Button onClick={() => handleOpenEditTask(selectedTask)}>Edit Task</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Add more dialogs for edit, delete, share, etc. */}
    </div>
  );
};

export default TaskList;
