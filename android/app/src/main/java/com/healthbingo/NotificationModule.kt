package com.healthbingo

import android.app.Activity
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import androidx.core.app.ActivityCompat
import androidx.core.app.NotificationCompat
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.Arguments

class NotificationModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private val notificationManager =
        reactContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

    private var permissionPromise: Promise? = null
    private var initialNotificationData: WritableMap? = null

    companion object {
        private const val CHANNEL_ID = "chat_messages"
        private const val CHANNEL_NAME = "Chat Messages"
        private const val PERMISSION_REQUEST_CODE = 1001

        @Volatile
        private var instance: NotificationModule? = null

        fun getInstance(context: Context): NotificationModule? = instance

        fun setInstance(module: NotificationModule) {
            instance = module
        }
    }

    init {
        setInstance(this)
        createNotificationChannel()
    }

    override fun getName(): String {
        return "NotificationModule"
    }

    fun setInitialNotificationData(intent: Intent?) {
        if (intent == null) {
            initialNotificationData = null
            return
        }

        val challengeId = intent.getStringExtra("challenge_id")
        val type = intent.getStringExtra("type")

        if (challengeId != null && type != null) {
            val data = Arguments.createMap()
            data.putString("challenge_id", challengeId)
            data.putString("type", type)
            initialNotificationData = data
        } else {
            initialNotificationData = null
        }
    }

    fun onRequestPermissionsResult(requestCode: Int, permissions: Array<out String>, grantResults: IntArray) {
        if (requestCode == PERMISSION_REQUEST_CODE) {
            val promise = permissionPromise
            permissionPromise = null

            val granted = grantResults.isNotEmpty() &&
                grantResults[0] == PackageManager.PERMISSION_GRANTED
            promise?.resolve(granted)
        }
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                CHANNEL_NAME,
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Notifications for new chat messages"
                enableVibration(true)
                vibrationPattern = longArrayOf(300, 200, 300)
                setShowBadge(true)
            }
            notificationManager.createNotificationChannel(channel)
        }
    }

    @ReactMethod
    fun requestNotificationPermission(promise: Promise) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU) {
            promise.resolve(true)
            return
        }

        val permission = android.Manifest.permission.POST_NOTIFICATIONS
        val currentPermission = ContextCompat.checkSelfPermission(
            reactApplicationContext,
            permission
        )

        if (currentPermission == PackageManager.PERMISSION_GRANTED) {
            promise.resolve(true)
            return
        }

        val activity = currentActivity
        if (activity == null) {
            promise.reject("NO_ACTIVITY", "No current activity available")
            return
        }

        permissionPromise = promise
        ActivityCompat.requestPermissions(
            activity,
            arrayOf(permission),
            PERMISSION_REQUEST_CODE
        )
    }

    private fun areNotificationsEnabled(): Boolean {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = notificationManager.getNotificationChannel(CHANNEL_ID)
            if (channel?.importance == NotificationManager.IMPORTANCE_NONE) {
                return false
            }
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            return ContextCompat.checkSelfPermission(
                reactApplicationContext,
                android.Manifest.permission.POST_NOTIFICATIONS
            ) == PackageManager.PERMISSION_GRANTED
        }

        return notificationManager.areNotificationsEnabled()
    }

    @ReactMethod
    fun showNotification(title: String, body: String, data: ReadableMap, promise: Promise) {
        try {
            if (!areNotificationsEnabled()) {
                promise.resolve(null)
                return
            }

            val context = reactApplicationContext
            val intent = Intent(context, MainActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                if (data.hasKey("challenge_id")) {
                    putExtra("challenge_id", data.getString("challenge_id"))
                }
                if (data.hasKey("type")) {
                    putExtra("type", data.getString("type"))
                }
            }

            val notificationId = System.currentTimeMillis().toInt()
            val pendingIntent = PendingIntent.getActivity(
                context,
                notificationId,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            val iconResId = context.resources.getIdentifier("ic_launcher", "mipmap", context.packageName)
            val smallIcon = if (iconResId != 0) iconResId else android.R.drawable.ic_dialog_info

            val notification = NotificationCompat.Builder(context, CHANNEL_ID)
                .setSmallIcon(smallIcon)
                .setContentTitle(title)
                .setContentText(body)
                .setStyle(NotificationCompat.BigTextStyle().bigText(body))
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setDefaults(NotificationCompat.DEFAULT_SOUND or NotificationCompat.DEFAULT_VIBRATE)
                .setAutoCancel(true)
                .setContentIntent(pendingIntent)
                .setShowWhen(true)
                .build()

            notificationManager.notify(notificationId, notification)
            promise.resolve(null)
        } catch (e: Exception) {
            promise.reject("NOTIFICATION_ERROR", e.message ?: "Unknown error", e)
        }
    }

    @ReactMethod
    fun getInitialNotificationData(promise: Promise) {
        val data = initialNotificationData
        if (data != null) {
            initialNotificationData = null
            promise.resolve(data)
        } else {
            promise.resolve(null)
        }
    }
}

