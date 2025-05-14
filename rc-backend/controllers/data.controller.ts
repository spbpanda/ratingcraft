// src/controllers/data.controller.ts

import { Request, Response } from 'express';
import { readJsonFile } from '../utils/file.utils';

export const getBases = (req: Request, res: Response) => {
  const data = readJsonFile('./data/bases.json');
  res.json(data);
};

export const getMiniGames = (req: Request, res: Response) => {
  const data = readJsonFile('./data/mini-games.json');
  res.json(data);
};

export const getMods = (req: Request, res: Response) => {
  const data = readJsonFile('./data/mods.json');
  res.json(data);
};

export const getPlugins = (req: Request, res: Response) => {
  const data = readJsonFile('./data/plugins.json');
  res.json(data);
};

export const getVersions = (req: Request, res: Response) => {
  const data = readJsonFile('./data/versions.json');
  res.json(data);
};