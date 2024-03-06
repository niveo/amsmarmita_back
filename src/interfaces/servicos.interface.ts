export interface ServicoInterface {
  create(enity: any): Promise<any>;
  findById(id: string): Promise<any>;
  findAll(): Promise<any[]>;
  delete(id: string): Promise<any>;
  update(id: string, entity: any): Promise<any>;
}
