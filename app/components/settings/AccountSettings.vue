<script setup lang="ts">
const { t } = useI18n()
const client = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()
const { isActive: isTelegram } = useTelegram()

const showDeleteConfirm = ref(false)
const newPassword = ref('')
const saving = ref(false)
const saved = ref(false)

async function changePassword() {
  if (!newPassword.value || newPassword.value.length < 6) return
  saving.value = true

  const { error } = await client.auth.updateUser({
    password: newPassword.value,
  })

  if (!error) {
    newPassword.value = ''
    saved.value = true
    setTimeout(() => { saved.value = false }, 2000)
  }
  saving.value = false
}

async function signOut() {
  await client.auth.signOut()
  await router.push('/auth/login')
}

function closeApp() {
  window.Telegram?.WebApp?.close()
}

async function deleteAccount() {
  await client.auth.signOut()
  await router.push('/auth/login')
}
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="text-base">{{ t('settings.account') }}</CardTitle>
    </CardHeader>
    <CardContent class="space-y-4">
      <div v-if="!isTelegram" class="space-y-2">
        <Label>{{ t('auth.email') }}</Label>
        <Input :model-value="user?.email ?? ''" disabled />
      </div>

      <div v-if="!isTelegram" class="space-y-2">
        <Label>{{ t('settings.changePassword') }}</Label>
        <div class="flex gap-2">
          <Input
            v-model="newPassword"
            type="password"
            :placeholder="t('auth.password')"
            minlength="6"
          />
          <Button :disabled="saving || newPassword.length < 6" @click="changePassword">
            {{ t('common.save') }}
          </Button>
        </div>
        <span v-if="saved" class="text-sm text-primary">{{ t('settings.saved') }}</span>
      </div>

      <Separator />

      <div class="flex flex-wrap gap-3">
        <Button v-if="isTelegram" variant="outline" @click="closeApp">
          {{ t('settings.closeApp') }}
        </Button>
        <Button v-else variant="outline" @click="signOut">
          {{ t('auth.signOut') }}
        </Button>
        <Button variant="destructive" @click="showDeleteConfirm = true">
          {{ t('settings.deleteAccount') }}
        </Button>
      </div>

      <Dialog v-model:open="showDeleteConfirm">
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{{ t('settings.deleteAccount') }}</DialogTitle>
            <DialogDescription>{{ t('settings.deleteConfirm') }}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" @click="showDeleteConfirm = false">
              {{ t('common.cancel') }}
            </Button>
            <Button variant="destructive" @click="deleteAccount">
              {{ t('common.delete') }}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CardContent>
  </Card>
</template>
