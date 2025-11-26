import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ProfileAvatar, AvatarPicker } from "@/components/profile-avatar";
import { ProfileSelectionSkeleton } from "@/components/loading-states";
import { useProfile } from "@/lib/profile-context";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Profile, InsertProfile } from "@shared/schema";
import { cn } from "@/lib/utils";

export default function ProfileSelection() {
  const { setCurrentProfile } = useProfile();
  const [isManaging, setIsManaging] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newProfile, setNewProfile] = useState<InsertProfile>({
    name: "",
    avatarIndex: 0,
    isKids: false,
  });

  const { data: profiles = [], isLoading } = useQuery<Profile[]>({
    queryKey: ["/api/profiles"],
  });

  const createMutation = useMutation({
    mutationFn: (profile: InsertProfile) =>
      apiRequest("POST", "/api/profiles", profile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profiles"] });
      setIsCreating(false);
      setNewProfile({ name: "", avatarIndex: 0, isKids: false });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (profile: Profile) =>
      apiRequest("PUT", `/api/profiles/${profile.id}`, profile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profiles"] });
      setEditingProfile(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest("DELETE", `/api/profiles/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profiles"] });
    },
  });

  const handleSelectProfile = (profile: Profile) => {
    if (!isManaging) {
      setCurrentProfile(profile);
    }
  };

  const handleCreateProfile = () => {
    if (newProfile.name.trim()) {
      createMutation.mutate(newProfile);
    }
  };

  const handleUpdateProfile = () => {
    if (editingProfile && editingProfile.name.trim()) {
      updateMutation.mutate(editingProfile);
    }
  };

  if (isLoading) {
    return <ProfileSelectionSkeleton />;
  }

  return (
    <div
      className="min-h-screen bg-background flex flex-col items-center justify-center p-8"
      data-testid="profile-selection-page"
    >
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2 text-primary">STREAMFLIX</h1>
        <h2 className="text-2xl text-foreground">
          {isManaging ? "Manage Profiles" : "Who's watching?"}
        </h2>
      </div>

      {/* Profile Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8 mb-12">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            className="flex flex-col items-center group"
          >
            <button
              onClick={() => handleSelectProfile(profile)}
              className={cn(
                "relative transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary rounded-md",
                !isManaging && "cursor-pointer"
              )}
              data-testid={`profile-${profile.id}`}
            >
              <ProfileAvatar
                avatarIndex={profile.avatarIndex}
                isKids={profile.isKids}
                size="lg"
              />
              {isManaging && (
                <div className="absolute inset-0 bg-black/60 rounded-md flex items-center justify-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-10 w-10 text-white hover:bg-white/20"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingProfile(profile);
                    }}
                    data-testid={`edit-profile-${profile.id}`}
                  >
                    <Pencil className="w-5 h-5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-10 w-10 text-red-400 hover:bg-red-500/20"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteMutation.mutate(profile.id);
                    }}
                    data-testid={`delete-profile-${profile.id}`}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              )}
            </button>
            <span className="mt-3 text-lg text-gray-300 group-hover:text-white transition-colors">
              {profile.name}
            </span>
            {profile.isKids && (
              <span className="text-xs text-yellow-400 font-medium">KIDS</span>
            )}
          </div>
        ))}

        {/* Add Profile Button */}
        {profiles.length < 5 && (
          <div className="flex flex-col items-center">
            <button
              onClick={() => setIsCreating(true)}
              className="w-32 h-32 rounded-md border-2 border-dashed border-gray-600 hover:border-gray-400 flex items-center justify-center transition-colors hover-elevate"
              data-testid="button-add-profile"
            >
              <Plus className="w-12 h-12 text-gray-500" />
            </button>
            <span className="mt-3 text-lg text-gray-400">Add Profile</span>
          </div>
        )}
      </div>

      {/* Manage Profiles Button */}
      <Button
        variant={isManaging ? "default" : "outline"}
        size="lg"
        onClick={() => setIsManaging(!isManaging)}
        className="px-8"
        data-testid="button-manage-profiles"
      >
        {isManaging ? "Done" : "Manage Profiles"}
      </Button>

      {/* Create Profile Dialog */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="sm:max-w-md" data-testid="create-profile-dialog">
          <DialogHeader>
            <DialogTitle>Create Profile</DialogTitle>
            <DialogDescription>Add a new profile with a custom name and avatar</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="flex justify-center">
              <ProfileAvatar
                avatarIndex={newProfile.avatarIndex}
                isKids={newProfile.isKids}
                size="xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-name">Name</Label>
              <Input
                id="profile-name"
                value={newProfile.name}
                onChange={(e) =>
                  setNewProfile({ ...newProfile, name: e.target.value })
                }
                placeholder="Enter profile name"
                maxLength={20}
                data-testid="input-profile-name"
              />
            </div>
            <div className="space-y-3">
              <Label>Choose Avatar</Label>
              <AvatarPicker
                selectedIndex={newProfile.avatarIndex}
                onSelect={(index) =>
                  setNewProfile({ ...newProfile, avatarIndex: index })
                }
                isKids={newProfile.isKids}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="kids-profile" className="cursor-pointer">
                Kids Profile
              </Label>
              <Switch
                id="kids-profile"
                checked={newProfile.isKids}
                onCheckedChange={(checked) =>
                  setNewProfile({ ...newProfile, isKids: checked })
                }
                data-testid="switch-kids-profile"
              />
            </div>
            {newProfile.isKids && (
              <p className="text-sm text-muted-foreground">
                This profile will only show G and PG rated content suitable for children.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreating(false)}
              data-testid="button-cancel-create"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateProfile}
              disabled={!newProfile.name.trim() || createMutation.isPending}
              data-testid="button-save-profile"
            >
              {createMutation.isPending ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Profile Dialog */}
      <Dialog open={!!editingProfile} onOpenChange={() => setEditingProfile(null)}>
        <DialogContent className="sm:max-w-md" data-testid="edit-profile-dialog">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>Update your profile name and avatar</DialogDescription>
          </DialogHeader>
          {editingProfile && (
            <div className="space-y-6 py-4">
              <div className="flex justify-center">
                <ProfileAvatar
                  avatarIndex={editingProfile.avatarIndex}
                  isKids={editingProfile.isKids}
                  size="xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-profile-name">Name</Label>
                <Input
                  id="edit-profile-name"
                  value={editingProfile.name}
                  onChange={(e) =>
                    setEditingProfile({ ...editingProfile, name: e.target.value })
                  }
                  placeholder="Enter profile name"
                  maxLength={20}
                  data-testid="input-edit-profile-name"
                />
              </div>
              <div className="space-y-3">
                <Label>Choose Avatar</Label>
                <AvatarPicker
                  selectedIndex={editingProfile.avatarIndex}
                  onSelect={(index) =>
                    setEditingProfile({ ...editingProfile, avatarIndex: index })
                  }
                  isKids={editingProfile.isKids}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="edit-kids-profile" className="cursor-pointer">
                  Kids Profile
                </Label>
                <Switch
                  id="edit-kids-profile"
                  checked={editingProfile.isKids}
                  onCheckedChange={(checked) =>
                    setEditingProfile({ ...editingProfile, isKids: checked })
                  }
                  data-testid="switch-edit-kids-profile"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditingProfile(null)}
              data-testid="button-cancel-edit"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateProfile}
              disabled={!editingProfile?.name.trim() || updateMutation.isPending}
              data-testid="button-update-profile"
            >
              {updateMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
