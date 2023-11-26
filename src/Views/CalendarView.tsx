import { debounce, PaneType, TFile, TAbstractFile } from 'obsidian';
import { ItemView, WorkspaceLeaf } from 'obsidian';
import * as React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { CalendarItem } from '../calendarItem';
import { ITimeIndex, MockTimeIndex, TimeIndex } from '../time';
import { CalendarContainer } from './CalendarContainer';
import { myMoment } from '../locale';
export const CALENDAR_VIEW = 'chronology-calendar-view';

export const TimeIndexContext = React.createContext<ITimeIndex>(new MockTimeIndex());

export class CalendarView extends ItemView {
  private _root?: Root;
  private get root() {
    if (this._root === undefined) {
      throw new Error('Root is undefined');
    }
    return this._root;
  }

  state = {
    date: new CalendarItem(myMoment())
  };

  constructor(leaf: WorkspaceLeaf) {
    super(leaf);

    this.state = {
      date: new CalendarItem(myMoment())
    };
    this.icon = 'clock';
  }

  getViewType() {
    return CALENDAR_VIEW;
  }

  getDisplayText() {
    return 'Mycoshiro Chronology';
  }

  async openNote(note: TFile, paneType: PaneType | boolean = false) {
    const leaf = app.workspace.getLeaf(paneType);
    await leaf.openFile(note);
  }

  render() {
    this.root.render(
      <React.StrictMode>
        <TimeIndexContext.Provider value={new TimeIndex(this.app)}>
          <CalendarContainer onOpen={this.openNote.bind(this)} {...this.state} />
        </TimeIndexContext.Provider>
      </React.StrictMode>
    );
  }

  onVaultChanged = debounce((file: TAbstractFile) => {
    this.state = { ...this.state };
    this.render();
  }, 300);

  async onOpen() {
    const { contentEl } = this;
    this._root = createRoot(contentEl /*.children[1]*/);
    this.render();
    this.app.vault.on('modify', this.onVaultChanged);
    this.app.vault.on('create', this.onVaultChanged);
    this.app.vault.on('delete', this.onVaultChanged);
    this.app.vault.on('rename', this.onVaultChanged);
  }

  async onClose() {
    this.app.vault.off('modify', this.onVaultChanged);
    this.app.vault.off('create', this.onVaultChanged);
    this.app.vault.off('delete', this.onVaultChanged);
    this.app.vault.off('rename', this.onVaultChanged);
    this.root.unmount();
  }
}
