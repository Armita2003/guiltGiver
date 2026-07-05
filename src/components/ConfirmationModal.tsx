import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { MealItemStyles } from "./MealItem.styles";

type ConfirmationModalProps = {
  visible: boolean;
  title: string;
  message: string;
  cancelLabel?: string;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
  confirmButtonStyle?: object | object[];
  cancelButtonStyle?: object | object[];
  confirmTextStyle?: object | object[];
  cancelTextStyle?: object | object[];
};

export default function ConfirmationModal({
  visible,
  title,
  message,
  cancelLabel = "Cancel",
  confirmLabel = "Confirm",
  onCancel,
  onConfirm,
  confirmButtonStyle,
  cancelButtonStyle,
  confirmTextStyle,
  cancelTextStyle,
}: ConfirmationModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={MealItemStyles.overlay}>
        <View style={MealItemStyles.modalCard}>
          <Text style={MealItemStyles.modalTitle}>{title}</Text>
          <Text style={MealItemStyles.modalText}>{message}</Text>
          <View style={MealItemStyles.buttonRow}>
            <TouchableOpacity
              style={[
                MealItemStyles.button,
                MealItemStyles.cancelButton,
                cancelButtonStyle,
              ]}
              onPress={onCancel}
            >
              <Text style={[MealItemStyles.buttonText, cancelTextStyle]}>
                {cancelLabel}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                MealItemStyles.button,
                MealItemStyles.deleteButton,
                confirmButtonStyle,
              ]}
              onPress={onConfirm}
            >
              <Text style={[MealItemStyles.buttonText, confirmTextStyle]}>
                {confirmLabel}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
