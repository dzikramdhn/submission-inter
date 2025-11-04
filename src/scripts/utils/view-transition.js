export async function applyViewTransition(callback) {
  if (document.startViewTransition) {
    await document.startViewTransition(callback);
  } else {
    await callback();
  }
}