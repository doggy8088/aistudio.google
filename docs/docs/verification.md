# 專案與帳號驗證

Google AI Studio 與 Gemini API 會要求部分免費層級專案與帳號完成行動裝置驗證。這項檢查有助於防止自動化濫用，讓免費層級能持續提供給開發人員使用。驗證時只需用手機掃描 QR 碼，不必分享電話號碼，也不用安裝應用程式。

付費層級專案不需要專案驗證。你隨時可以[設定計費](/docs/billing/#setup-billing)，改用付費層級。

[在 AI Studio 中開啟 Projects](https://aistudio.google.com/projects)

## 驗證需求 {#when-required}

以下兩種情況可能需要完成行動裝置驗證：

* **專案驗證**：在額外建立的專案，或在 Google AI Studio 之外建立的專案上使用免費層級時需要驗證。未驗證的專案會在 [Projects](https://aistudio.google.com/projects) 頁面顯示 **Verification needed**，並傳回 `403`（`FREE_TIER_VERIFICATION_REQUIRED`）。
* **帳號驗證**：當 Google AI Studio 偵測到你的 Google 帳號有異常活動時需要驗證。Google AI Studio 會顯示「Account verification required to restore access」訊息，並附上 **Verify your account** 連結。

免費層級專案需要驗證時，API 會傳回一則錯誤訊息，其中包含該專案的驗證連結：

```none
Project 123456789012 must be verified before it can use the Gemini API Free tier. Verify the project at https://aistudio.google.com/verify?project=123456789012, or set up billing at https://aistudio.google.com/billing to use the paid tier instead. Learn more at https://ai.google.dev/gemini-api/docs/verification.
```

## 驗證免費層級專案 {#verify-project}

驗證 Google Cloud 專案之前，你需要具備該專案的編輯權限。請確認你的帳號在該專案上擁有 **Owner** 或 **Editor** IAM 角色。

1. 開啟錯誤訊息中的驗證連結（`https://aistudio.google.com/verify?project=PROJECT_NUMBER`），或在 [Projects](https://aistudio.google.com/projects) 頁面點選 **Verify project**。
2. 點選 **Verify device**。
3. 用 Android 手機或 iPhone 相機掃描 QR 碼，然後依照手機上的提示操作。
4. 等待「Project verified」確認訊息出現，接著重試你的 API 請求，或點選 **Get API key**。


!!! note " "

      在同一個未驗證的專案中建立新的 API 金鑰，無法繞過驗證。Google 是在 Google Cloud 專案層級套用驗證。


## 不驗證改用付費層級 {#use-paid-tier}

如果你不想使用行動裝置驗證，可以將專案升級為付費層級：

1. 在驗證頁面或對話框中點選 **Set up billing**，或在 [Projects](https://aistudio.google.com/projects) 或 [API keys](https://aistudio.google.com/api-keys) 頁面中，點選專案旁的 **Set up billing**。
2. 為專案選取或建立一個有效的 Cloud Billing 帳戶；若系統提示，也請加入 [Prepay 額度](/docs/billing/#prepay)。

Google 會依 [Gemini API 定價](/docs/pricing/)向付費層級用量收費，或從符合資格的額度中扣除。Google Cloud 免費試用帳戶在升級之前會維持在免費層級。Prepay 帳戶也需要維持正的額度餘額。

## 驗證你的帳號 {#verify-account}

如果 Google AI Studio 因異常活動提示你驗證 Google 帳號：

1. 登入受影響的 Google 帳號後，開啟 [aistudio.google.com/verify-account](https://aistudio.google.com/verify-account)。
2. 點選 **Verify device**，用 Android 手機或 iPhone 相機掃描 QR 碼。
3. 依照手機上的提示操作，驗證成功後點選 **Go to AI Studio**。

如果你不想驗證帳號，可以改為在 Google AI Studio 中[設定計費](/docs/billing/#setup-billing)，並使用付費層級 API 金鑰。

## 裝置需求 {#device-requirements}

行動裝置驗證會使用 Google reCAPTCHA，在實體手機上檢查裝置完整性：

* **Android**：具備 Google Play 服務且可連上網路的 Android 手機。已 root 的手機，或 bootloader 已解鎖的手機無法通過。
* **iPhone**：執行 iOS 16.4 以上版本、可連上網路且已開啟 App Clips 的 iPhone。掃描 QR 碼會開啟輕量的 App Clip，不需要安裝應用程式。

桌上型電腦、模擬器與虛擬裝置無法完成驗證。

## 疑難排解驗證問題 {#troubleshoot}

使用下表解決 Google AI Studio 中常見的驗證訊息。

| 錯誤訊息 | 原因 | 解決方式 |
| :--- | :--- | :--- |
| `We couldn't verify this project with your device` | 你的手機已達到跨專案的驗證次數上限，或未通過裝置安全檢查。 | 改用另一支符合資格的手機、稍後再試，或[設定計費](/docs/billing/#setup-billing)改用付費層級。在 iPhone 上，請在 **Settings > Screen Time > Content & Privacy Restrictions > Content Restrictions > App Clips** 中允許 App Clips。 |
| `We couldn't verify your account with this device` | 你的手機已達到近期的驗證次數上限，或未通過裝置安全檢查。 | 改用另一支符合資格的手機、稍後再試，或[設定計費](/docs/billing/#setup-billing)並使用付費層級 API 金鑰。在 iPhone 上，請在 **Settings > Screen Time > Content & Privacy Restrictions > Content Restrictions > App Clips** 中允許 App Clips。 |
| `Something went wrong while verifying your device` | 網路規則或瀏覽器擴充功能封鎖了 Google reCAPTCHA 指令碼。 | 請允許 `google.com` 與 `gstatic.com` 的指令碼在 `aistudio.google.com` 上執行、關閉廣告封鎖程式，或在無痕視窗中重試。 |
| `You need permission to edit this project to verify it` | 你的 Google 帳號可以檢視該專案，但缺少 `resourcemanager.projects.update` 權限。 | 請專案的 **Owner** 或 **Editor** 進行驗證。自訂角色需要 `resourcemanager.projects.get` 與 `resourcemanager.projects.update`（請參閱 [IAM 權限](/docs/troubleshoot-ai-studio/#iam-permissions)）。 |
| `Project not found` | 專案編號無效、專案未啟用，或你的 Google 帳號缺少 `resourcemanager.projects.get` 存取權。 | 登入具有專案存取權的 Google 帳號，或在 [Projects](https://aistudio.google.com/projects) 頁面選取一個啟用中的專案。 |

## 限制 {#limitations}

* 每支行動裝置在一段滾動期間內，只能驗證有限數量的專案或帳號。
* 驗證需要受支援的 Android 手機或 iPhone，不支援簡訊、語音通話或硬體安全金鑰。

## 後續步驟 {#whats-next}

* [使用 Gemini API 金鑰](/docs/api-key/)：為已驗證的專案建立及管理 API 金鑰。
* [計費](/docs/billing/)：將專案升級為付費層級，並管理 Prepay 額度。
* [疑難排解指南](/docs/troubleshooting/)：診斷其他 `403` 與 API 錯誤。
