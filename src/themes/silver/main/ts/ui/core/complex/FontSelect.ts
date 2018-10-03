import { AlloyTriggers } from '@ephox/alloy';
import { Option, Arr } from '@ephox/katamari';
import { updateMenuText } from '../../dropdown/CommonDropdown';
import { createSelectButton } from './BespokeSelect';
import { buildBasicSettingsDataset, Delimiter } from './SelectDatasets';

const defaultFontsFormats = 'Andale Mono=andale mono,monospace;' +
  'Arial=arial,helvetica,sans-serif;' +
  'Arial Black=arial black,sans-serif;' +
  'Book Antiqua=book antiqua,palatino,serif;' +
  'Comic Sans MS=comic sans ms,sans-serif;' +
  'Courier New=courier new,courier,monospace;' +
  'Georgia=georgia,palatino,serif;' +
  'Helvetica=helvetica,arial,sans-serif;' +
  'Impact=impact,sans-serif;' +
  'Symbol=symbol;' +
  'Tahoma=tahoma,arial,helvetica,sans-serif;' +
  'Terminal=terminal,monaco,monospace;' +
  'Times New Roman=times new roman,times,serif;' +
  'Trebuchet MS=trebuchet ms,geneva,sans-serif;' +
  'Verdana=verdana,geneva,sans-serif;' +
  'Webdings=webdings;' +
  'Wingdings=wingdings,zapf dingbats';

const createFontSelect = (editor, backstage) => {
  const getMatchingValue = (): Option<{ title: string, format: string }> => {
    const getFirstFont = (fontFamily) => {
      return fontFamily ? fontFamily.split(',')[0] : '';
    };

    const fontFamily = editor.queryCommandValue('FontName');
    const items = dataset.data;
    const font = fontFamily ? fontFamily.toLowerCase() : '';

    return Arr.find(items, (item) => {
      const format = item.format;
      if ((format.toLowerCase() === font)
        || (getFirstFont(format).toLowerCase() === getFirstFont(font).toLowerCase())) {
        return true;
      }
      return false;
    });
  };

  const isSelectedFor = (item) => {
    return () => {
      return getMatchingValue().exists((match) => match.format === item);
    };
  };

  const getPreviewFor = (item) => () => {
    return Option.some({
      tag: 'div',
      styleAttr: item.indexOf('dings') === -1 ? 'font-family:' + item : ''
    });
  };

  const onAction = (rawItem) => () => {
    editor.undoManager.transact(() => {
      editor.focus();
      editor.execCommand('FontName', false, rawItem.format);
    });
  };

  const nodeChangeHandler = Option.some((comp) => {
    return () => {
      const fontFamily = editor.queryCommandValue('FontName');
      const match = getMatchingValue();
      const text = match.fold(() => fontFamily, (item) => item.title);
      AlloyTriggers.emitWith(comp, updateMenuText, {
        text
      });
    };
  });

  const dataset = buildBasicSettingsDataset(editor, 'font_formats', defaultFontsFormats, Delimiter.SemiColon);

  return createSelectButton(editor, backstage, dataset, {
    isSelectedFor,
    getPreviewFor,
    onAction,
    nodeChangeHandler
  });
};

export { createFontSelect };