import api from './api';

export const getStudyMaterials = async () => {
  const res = await api.get('/api/studymaterials');
  return res.data;
};

export const getPreviousYearPapers = async () => {
  const res = await api.get('/api/previousyearpapers');
  return res.data;
};

export const getDepartments = async () => {
  const res = await api.get('/api/departments');
  return res.data;
};

export const getDepartmentCareerStats = async () => {
  const res = await api.get('/api/departments/career-stats');
  return res.data;
};

export const getSocieties = async () => {
  const res = await api.get('/api/societies');
  return res.data;
};

export const getFAQs = async () => {
  const res = await api.get('/api/faqs');
  return res.data;
};

export const getLingo = async () => {
  const res = await api.get('/api/lingo');
  return res.data;
};

export const getEvents = async () => {
  const res = await api.get('/api/events');
  return res.data;
};

export const getJosaaCutoffs = async (year) => {
  const res = await api.get(`/api/josaacutoffs/${year}`);
  return res.data;
};
